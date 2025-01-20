import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchEvent, updateEvent } from '@/api/editEventApi';
import { updateMetadata } from "@/utils/metadata";


const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  about: z.string().min(10, "About section must be at least 10 characters"),
  websiteUrl: z.string().url("Please enter a valid website URL"),
  emails: z.string().min(1, "At least one email is required"),
  phoneNumbers: z.string().min(1, "At least one phone number is required"),
  registrationUrl: z.string().url("Please enter a valid registration URL"),
  price: z.number().min(0, "Price cannot be negative"),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
  paid: z.boolean().default(false),
  guidlines: z.string().min(1, "At least one guideline is required"),
  venue: z.object({
    mapUrl: z.string().url("Please enter a valid map URL"),
    name: z.string().min(1, "Venue name is required"),
  }),
  type: z.enum(["OFFLINE", "ONLINE"]),
  subEventName: z.string().min(1, "Sub event name is required"),
  subEventAbout: z.string().min(1, "Sub event description is required"),
  subEventFrom: z.string().min(1, "Sub event start time is required"),
  subEventTo: z.string().min(1, "Sub event end time is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateForAPI = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString();
};

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  // useEffect(() => {
    
  // }, []);
  

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await fetchEvent(id);
        setValue("name", eventData.name);
        setValue("about", eventData.about);
        setValue("websiteUrl", eventData.websiteUrl);
        setValue("emails", eventData.emails.join(", "));
        setValue("phoneNumbers", eventData.phoneNumbers.join(", "));
        setValue("registrationUrl", eventData.registrationUrl);
        setValue("paid", eventData.paid);
        setValue("price", eventData.price);
        setValue("from", formatDateForInput(eventData.from));
        setValue("to", formatDateForInput(eventData.to));
        setValue("guidlines", eventData.guidlines.join("\n"));
        updateMetadata({
          title: `Edit ${eventData.name}`,
          description: `Edit details for event: ${eventData.name}`,
          keywords: `edit event, ${eventData.name}, ${eventData.society.name}, nexturday`,
        });

        if (eventData.details && eventData.details[0]) {
          const subEvent = eventData.details[0];
          setValue("subEventName", subEvent.name);
          setValue("subEventAbout", subEvent.about);
          setValue("subEventFrom", formatDateForInput(subEvent.from));
          setValue("subEventTo", formatDateForInput(subEvent.to));
          setValue("type", subEvent.type);
          
          if (subEvent.venue) {
            setValue("venue.mapUrl", subEvent.venue.mapUrl);
            setValue("venue.name", subEvent.venue.name);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, setValue]);

  const onSubmit = async (data: EventFormData) => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all form errors before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("about", data.about);
      formData.append("websiteUrl", data.websiteUrl);
      formData.append("emails", JSON.stringify(data.emails.split(',').map(email => email.trim())));
      formData.append("guidlines", JSON.stringify(data.guidlines.split('\n').filter(line => line.trim())));
      formData.append("phoneNumbers", JSON.stringify(data.phoneNumbers.split(',').map(phone => phone.trim())));
      formData.append("registrationUrl", data.registrationUrl);
      formData.append("price", data.paid ? data.price.toString() : "0");
      formData.append("from", formatDateForAPI(data.from));
      formData.append("to", formatDateForAPI(data.to));
      formData.append("paid", data.paid.toString());
      formData.append("details", JSON.stringify([
        {
          name: data.subEventName,
          about: data.subEventAbout,
          from: formatDateForAPI(data.subEventFrom),
          to: formatDateForAPI(data.subEventTo),
          type: data.type,
          venue: {
            mapUrl: data.venue.mapUrl,
            name: data.venue.name
          }
        }
      ]));
      formData.append("imagesKeys", JSON.stringify([]));
      
      await updateEvent(id, formData);
      toast.success("Event updated successfully");
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const onError = () => {  
    toast.error("Please fix all form errors before submitting");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-700">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xl font-medium">Loading event data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-800 text-white">
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Event</span>
            </button>
            <h1 className="text-3xl font-bold">Edit Event</h1>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="p-4 m-6 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please fix the following errors:
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key} className="text-red-600 text-sm">
                    {key}: {error?.message as string}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </div>
              <div className="grid grid-cols-1 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    {...register("about")}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.about && <p className="mt-1 text-sm text-red-600">{errors.about.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    {...register("websiteUrl")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.websiteUrl && <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </div>
              <div className="grid grid-cols-1 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emails (comma-separated)
                  </label>
                  <input
                    type="text"
                    {...register("emails")}
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.emails && <p className="mt-1 text-sm text-red-600">{errors.emails.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Numbers (comma-separated)
                  </label>
                  <input
                    type="text"
                    {...register("phoneNumbers")}
                    placeholder="+1234567890, +0987654321"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.phoneNumbers && <p className="mt-1 text-sm text-red-600">{errors.phoneNumbers.message}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    {...register("from")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    {...register("to")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration URL</label>
                  <input
                    type="url"
                    {...register("registrationUrl")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.registrationUrl && <p className="mt-1 text-sm text-red-600">{errors.registrationUrl.message}</p>}
                </div>

                <div className="md:col-span-2 flex items-center gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("paid")}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-900">Paid Event</label>
                  </div>

                  {watch("paid") && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Sub Event Details
              </div>
              <div className="grid grid-cols-1 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Event Name</label>
                  <input
                    type="text"
                    {...register("subEventName")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.subEventName && <p className="mt-1 text-sm text-red-600">{errors.subEventName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Event Description</label>
                  <textarea
                    {...register("subEventAbout")}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.subEventAbout && <p className="mt-1 text-sm text-red-600">{errors.subEventAbout.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Event Start Time</label>
                    <input
                      type="datetime-local"
                      {...register("subEventFrom")}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.subEventFrom && <p className="mt-1 text-sm text-red-600">{errors.subEventFrom.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Event End Time</label>
                    <input
                      type="datetime-local"
                      {...register("subEventTo")}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.subEventTo && <p className="mt-1 text-sm text-red-600">{errors.subEventTo.message}</p>}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Venue Details
              </div>
              <div className="grid grid-cols-1 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                  <input
                    type="text"
                    {...register("venue.name")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.venue?.name && <p className="mt-1 text-sm text-red-600">{errors.venue.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Map URL</label>
                  <input
                    type="url"
                    {...register("venue.mapUrl")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.venue?.mapUrl && <p className="mt-1 text-sm text-red-600">{errors.venue.mapUrl.message}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Guidelines
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guidelines (one per line)
                </label>
                <textarea
                  {...register("guidlines")}
                  rows={4}
                  placeholder="Enter each guideline on a new line"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.guidlines && <p className="mt-1 text-sm text-red-600">{errors.guidlines.message}</p>}
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/events/${id}`)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || Object.keys(errors).length > 0}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg flex items-center gap-2
                  ${submitting || Object.keys(errors).length > 0
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Update Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent; 