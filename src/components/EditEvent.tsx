import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Zod schema for venue
const venueSchema = z.object({
  mapUrl: z.string().url("Please enter a valid map URL"),
  name: z.string().min(1, "Venue name is required"),
});

// Zod schema for event details
const detailSchema = z.object({
  name: z.string().min(1, "Detail name is required"),
  about: z.string().min(1, "Detail description is required"),
  from: z.string().min(1, "Start time is required"),
  to: z.string().min(1, "End time is required"),
  type: z.enum(["OFFLINE", "ONLINE"]),
  venue: venueSchema,
});

// Main event schema
const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  about: z.string().min(10, "About section must be at least 10 characters"),
  websiteUrl: z.string().url("Please enter a valid website URL"),
  // Handle comma-separated strings for emails and phone numbers
  emails: z.string().min(1, "At least one email is required"),
  phoneNumbers: z.string().min(1, "At least one phone number is required"),
  registrationUrl: z.string().url("Please enter a valid registration URL"),
  price: z.number().min(0, "Price cannot be negative"),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
  paid: z.boolean().default(false),
  // Handle newline-separated guidelines
  guidlines: z.string().min(1, "At least one guideline is required"),
  // Handle venue details
  venue: z.object({
    mapUrl: z.string().url("Please enter a valid map URL"),
    name: z.string().min(1, "Venue name is required"),
  }),
  // Handle event type
  type: z.enum(["OFFLINE", "ONLINE"]),
  // Handle session details
  sessionName: z.string().min(1, "Session name is required"),
  sessionAbout: z.string().min(1, "Session description is required"),
  sessionFrom: z.string().min(1, "Session start time is required"),
  sessionTo: z.string().min(1, "Session end time is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

// Update the form data type to handle guidelines array
interface GuidelineField {
  value: string;
  id: string; // For React key prop
}

// Add this helper function at the top of the file, after imports
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  // Format the date manually to ensure correct format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Return in format "yyyy-MM-ddThh:mm"
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Add this helper to convert back to UTC for API
const formatDateForAPI = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString();
};

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [guidelines, setGuidelines] = useState<GuidelineField[]>([{ value: '', id: '1' }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
  });

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/events/${id}`);
        const eventData = response.data.data;
        
        // Set form values
        Object.keys(eventData).forEach((key) => {
          if (key === 'guidlines') {
            setGuidelines(
              eventData.guidlines.map((guideline: string, index: number) => ({
                value: guideline,
                id: (index + 1).toString()
              }))
            );
          } else if (key === 'from' || key === 'to') {
            // Format dates for datetime-local input
            setValue(key, formatDateForInput(eventData[key]));
          } else if (key in eventSchema.shape) {
            setValue(key as keyof EventFormData, eventData[key]);
          }
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, setValue]);

  // Add guideline field
  const addGuideline = () => {
    setGuidelines([
      ...guidelines,
      { value: '', id: (guidelines.length + 1).toString() }
    ]);
  };

  // Remove guideline field
  const removeGuideline = (idToRemove: string) => {
    if (guidelines.length > 1) {
      setGuidelines(guidelines.filter(g => g.id !== idToRemove));
    }
  };

  // Update guideline value
  const updateGuideline = (id: string, value: string) => {
    setGuidelines(
      guidelines.map(g => (g.id === id ? { ...g, value } : g))
    );
  };

  const onSubmit = async (data: EventFormData) => {
    console.log("Form Data:", data);
    
    if (Object.keys(errors).length > 0) {
      console.log("Validation Errors:", errors);
      toast.error("Please fix all form errors before submitting");
      return;
    }

    setSubmitting(true);
    try {
      // Convert form data to API format
      const formData = {
        ...data,
        from: formatDateForAPI(data.from),
        to: formatDateForAPI(data.to),
        emails: data.emails.split(',').map(email => email.trim()),
        phoneNumbers: data.phoneNumbers.split(',').map(phone => phone.trim()),
        guidlines: data.guidlines.split('\n').filter(line => line.trim()),
        details: [{
          name: data.sessionName,
          about: data.sessionAbout,
          from: formatDateForAPI(data.sessionFrom),
          to: formatDateForAPI(data.sessionTo),
          type: data.type,
          venue: data.venue
        }]
      };
      
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/events/${id}`, formData);
      toast.success("Event updated successfully");
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Form Errors:", errors);
    toast.error("Please fix all form errors before submitting");
  };

  if (loading) {
    return <div className="text-center py-10">Loading event data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key} className="text-red-600 text-sm">
                  {key}: {error?.message as string}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
          {/* Basic Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  {...register("about")}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.about && <p className="mt-1 text-sm text-red-600">{errors.about.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                <input
                  type="url"
                  {...register("websiteUrl")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.websiteUrl && <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Contact Information</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emails (comma-separated)
                </label>
                <input
                  type="text"
                  {...register("emails")}
                  placeholder="email1@example.com, email2@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.emails && <p className="mt-1 text-sm text-red-600">{errors.emails.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Numbers (comma-separated)
                </label>
                <input
                  type="text"
                  {...register("phoneNumbers")}
                  placeholder="+1234567890, +0987654321"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.phoneNumbers && <p className="mt-1 text-sm text-red-600">{errors.phoneNumbers.message}</p>}
              </div>
            </div>
          </section>

          {/* Event Details */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  {...register("from")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  {...register("to")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Registration URL</label>
              <input
                type="url"
                {...register("registrationUrl")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.registrationUrl && <p className="mt-1 text-sm text-red-600">{errors.registrationUrl.message}</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("paid")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-900">Paid Event</label>
              </div>

              {watch("paid") && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
              )}
            </div>
          </section>

          {/* Session Details */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Session Details</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Name</label>
                <input
                  type="text"
                  {...register("sessionName")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.sessionName && <p className="mt-1 text-sm text-red-600">{errors.sessionName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Session Description</label>
                <textarea
                  {...register("sessionAbout")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.sessionAbout && <p className="mt-1 text-sm text-red-600">{errors.sessionAbout.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session Start Time</label>
                  <input
                    type="datetime-local"
                    {...register("sessionFrom")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.sessionFrom && <p className="mt-1 text-sm text-red-600">{errors.sessionFrom.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Session End Time</label>
                  <input
                    type="datetime-local"
                    {...register("sessionTo")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.sessionTo && <p className="mt-1 text-sm text-red-600">{errors.sessionTo.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  {...register("type")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="OFFLINE">Offline</option>
                  <option value="ONLINE">Online</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>
            </div>
          </section>

          {/* Venue Details */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Venue Details</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                <input
                  type="text"
                  {...register("venue.name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.venue?.name && <p className="mt-1 text-sm text-red-600">{errors.venue.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Map URL</label>
                <input
                  type="url"
                  {...register("venue.mapUrl")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.venue?.mapUrl && <p className="mt-1 text-sm text-red-600">{errors.venue.mapUrl.message}</p>}
              </div>
            </div>
          </section>

          {/* Guidelines */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Guidelines</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guidelines (one per line)
              </label>
              <textarea
                {...register("guidlines")}
                rows={4}
                placeholder="Enter each guideline on a new line"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.guidlines && <p className="mt-1 text-sm text-red-600">{errors.guidlines.message}</p>}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || Object.keys(errors).length > 0}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                submitting || Object.keys(errors).length > 0
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent; 