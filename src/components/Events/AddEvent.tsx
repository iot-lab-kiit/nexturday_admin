import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CreateEvent } from "@/api/event";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

//React icons
import { MdArrowBack, MdDelete, MdOutlineFileUpload } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { fetchEvent, updateEvent } from "@/api/editEventApi";
import LoadingSpinner from "../Global/LoadingSpinner";
// import Sidebar from "../Global/Sidebar";

// import types
import {
  EventType,
  VenueType,
  DetailType,
  FormDataType,
  ApiResponse,
  ConfirmationModalProps,
  AddEventProps,
} from "../../types";

const availableTags = ["Tech", "Cultural", "Fun", "Workshop", "Hackathon"];

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
        <p className="text-sm text-gray-600 mt-2">{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const AddEvent: React.FC<AddEventProps> = ({ isEditing }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState<FormDataType>({
    eventName: "",
    about: "",
    guidelines: [""],
    eventType: "ONLINE",
    eventTags: "",
    fromDate: "",
    toDate: "",
    website: "",
    emails: [""],
    teamSize: 1,
    isOutsideParticipantsAllowed: false,
    contactNumbers: [""],
    registrationUrl: "",
    isPaidEvent: false,
    price: 0,
    deadline: "",
    selectedFiles: [],
    selectedDocs: [],
    backendImages: [],
    imagesKeys: [],
    details: [
      {
        name: "",
        about: "",
        from: "",
        to: "",
        type: "ONLINE",
        venue: {
          name: "",
          mapUrl: "",
        },
      },
    ],
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setloading] = useState(false);
  const [oneDay, setOneDay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && id) {
      const fetchEventById = async (eventID: string) => {
        try {
          setloading(true);
          const response = await fetchEvent(eventID);

          const transformedData = await transformApiResponseToFormData(
            response
          );
          const fromDate = new Date(transformedData.fromDate)
            .toISOString()
            .split("T")[0];
          const toDate = new Date(transformedData.toDate)
            .toISOString()
            .split("T")[0];

          setOneDay(toDate === fromDate);
          setFormData(transformedData);
        } catch (error) {
          console.error("Error fetching event data:", error);
          toast.error("Failed to load event data for editing.");
        } finally {
          setloading(false);
        }
      };

      fetchEventById(id);
    }
  }, [id, isEditing]);

  const handleOneDayEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOneDay(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        details: [
          {
            name: prev.eventName,
            about: prev.about,
            from: prev.fromDate,
            to: prev.toDate,
            type: "ONLINE",
            venue: {
              name: "",
              mapUrl: "",
            },
          },
        ],
      }));
    }
  };

  const transformApiResponseToFormData = async (
    apiData: ApiResponse
  ): Promise<FormDataType> => {
    return {
      eventName: apiData.name || "",
      about: apiData.about || "",
      guidelines: apiData.guidlines || [""],
      eventType: apiData.type || "ONLINE",
      fromDate: formatDateForInput(apiData.from || ""),
      toDate: formatDateForInput(apiData.to || ""),
      website: apiData.websiteUrl || "",
      emails: apiData.emails || [""],
      teamSize: apiData.teamSize || 1,
      isOutsideParticipantsAllowed:
        apiData.isOutsideParticipantsAllowed || false,
      eventTags: apiData.eventTags || "",
      contactNumbers: apiData.phoneNumbers || [""],
      registrationUrl: apiData.registrationUrl || "",
      isPaidEvent: apiData.paid || false,
      price: apiData.price || 0,
      deadline: formatDateForInput(apiData.deadline || ""),
      selectedFiles: [],
      selectedDocs: [],
      backendImages: apiData.images || [],
      details:
        apiData.details?.map((subEvent: DetailType) => ({
          name: subEvent.name || "",
          about: subEvent.about || "",
          from: formatDateForInput(subEvent.from),
          to: formatDateForInput(subEvent.to),
          type: subEvent.type || "ONLINE",
          venue: subEvent.venue
            ? { name: subEvent.venue.name, mapUrl: subEvent.venue.mapUrl }
            : { name: "", mapUrl: "" },
        })) || [],
    };
  };

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;

    // Handle checkbox inputs
    const checked =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : undefined;

    // Handle file inputs
    const file =
      type === "file" && e.target instanceof HTMLInputElement
        ? e.target.files?.[0] // Get the first selected file
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : type === "file" ? file : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const currentFiles = formData.selectedFiles;

    // Check file limit
    if (currentFiles.length + newFiles.length > 1) {
      handleError("You can upload a maximum of 1 image.");
      e.target.value = "";
      return;
    }

    try {
      const compressedFiles = await Promise.all(
        newFiles.map(async (file) => {
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1024,
              useWebWorker: true,
            });

            return compressedFile;
          } catch (error) {
            console.error("Compression failed for file:", file.name, error);
            return file; // Fallback to original file
          }
        })
      );

      setFormData((prev) => ({
        ...prev,
        selectedFiles: currentFiles.concat(compressedFiles),
      }));
    } catch (error) {
      console.error("Error during file processing:", error);
      handleError("Failed to process the selected files.");
    } finally {
      e.target.value = ""; // Reset input value
    }
  };

  //For document upload
  const handleDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const currentFiles = formData.selectedDocs;

    // Check file limit
    if (currentFiles.length + newFiles.length > 1) {
      handleError("You can upload a maximum of 1 pdf.");
      e.target.value = "";
      return;
    }

    try {
      const compressedFiles = await Promise.all(
        newFiles.map(async (file) => {
          try {
            if (file.type === "application/pdf") {
              const fileSizeInMB = file.size / (1024 * 1024);
              if (fileSizeInMB > 10) {
                handleError(
                  `${file.name} exceeds 10 MB and won't be processed.`
                );
                return null; // Skip large files
              }
              return file; // Return PDF file without compression
            } else {
              handleError(`${file.name} is not a PDF file.`);
              return;
            }
          } catch (error) {
            console.error("Processing failed for file:", file.name, error);
            return file;
          }
        })
      );

      setFormData((prev) => ({
        ...prev,
        selectedDocs: currentFiles.concat(
          compressedFiles.filter(
            (file): file is File => file !== null && file !== undefined
          )
        ),
      }));
    } catch (error) {
      console.error("Error during file processing:", error);
      handleError("Failed to process the selected files.");
    } finally {
      e.target.value = ""; // Reset input value
    }
  };

  const handleRemoveImage = (index: number, isBackend: boolean) => {
    if (isBackend) {
      setFormData((prev) => {
        const backendImages = prev.backendImages || [];
        const removedKey = backendImages[index]?.key;

        return {
          ...prev,
          backendImages: backendImages.filter((_, i) => i !== index),
          imagesKeys: removedKey
            ? [...(prev.imagesKeys || []), removedKey]
            : prev.imagesKeys || [],
        };
      });
    } else {
      setFormData((prev) => {
        const updatedFiles = [...prev.selectedFiles];
        updatedFiles.splice(index, 1);
        return {
          ...prev,
          selectedFiles: updatedFiles,
        };
      });
    }
  };

  //Remove document
  const handleRemoveDoc = (index: number) => {
    if (index === 0) {
      setFormData((prev) => {
        const updatedDocs = [...prev.selectedDocs];
        updatedDocs.splice(index, 1);
        return {
          ...prev,
          selectedDocs: updatedDocs,
        };
      });
    } else {
      setFormData((prev) => {
        const updatedFiles = [...prev.selectedDocs];
        updatedFiles.splice(index, 1);
        return {
          ...prev,
          selectedDocs: updatedFiles,
        };
      });
    }
  };

  const handleAddGuideline = () => {
    setFormData((prev) => ({
      ...prev,
      guidelines: [...prev.guidelines, ""],
    }));
  };

  const handleGuidelineChange = (index: number, value: string) => {
    const updatedGuidelines = [...formData.guidelines];
    updatedGuidelines[index] = value; // Allow users to edit freely
    setFormData((prev) => ({
      ...prev,
      guidelines: updatedGuidelines,
    }));
  };

  const handleRemoveGuideline = (index: number) => {
    const updatedGuidelines = formData.guidelines.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      guidelines: updatedGuidelines.length > 0 ? updatedGuidelines : [""],
    }));
  };

  const handleAddContactNumber = () => {
    setFormData((prev) => ({
      ...prev,
      contactNumbers: [...prev.contactNumbers, ""],
    }));
  };

  const handleContactNumberChange = (index: number, value: string) => {
    const updatedContacts = [...formData.contactNumbers];
    updatedContacts[index] = value.trim();
    setFormData((prev) => ({
      ...prev,
      contactNumbers: updatedContacts,
    }));
  };

  const handleRemoveContactNumber = (index: number) => {
    const updatedContacts = formData.contactNumbers.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      contactNumbers: updatedContacts.length > 0 ? updatedContacts : [""],
    }));
  };

  const handleAddEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index] = value.trim(); // Remove leading/trailing spaces
    setFormData((prev) => ({
      ...prev,
      emails: updatedEmails,
    }));
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = formData.emails.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      emails: updatedEmails.length > 0 ? updatedEmails : [""], // Remove empty strings
    }));
  };

  const handleDetailFieldChange = (
    index: number,
    field: keyof DetailType,
    value: string | EventType,
    subField?: keyof VenueType
  ) => {
    setFormData((prevState) => {
      const updatedDetails = [...prevState.details];

      if (field === "venue" && subField) {
        updatedDetails[index].venue[subField] = value as string;
      } else if (field === "type") {
        updatedDetails[index].type = value as EventType;
      } else if (field !== "venue") {
        updatedDetails[index][field] = value as DetailType[typeof field];
      }

      const updatedEventType =
        typeof value === "string" && (value === "ONLINE" || value === "OFFLINE")
          ? (value as EventType)
          : prevState.eventType;

      return {
        ...prevState,
        details: updatedDetails,
        eventType: updatedEventType,
      };
    });
  };

  const addSubEvent = () => {
    if (oneDay && formData.details.length === 1) {
      toast.error("It is a one day event");
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      details: [
        ...prevState.details,
        {
          name: "",
          about: "",
          from: "",
          to: "",
          type: "ONLINE",
          venue: {
            name: "",
            mapUrl: "",
          },
        },
      ],
    }));
  };

  const removeSubEvent = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      details: prevState.details.filter((_, i) => i !== index),
    }));
    setModalOpen(false);
  };

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // console.log("formData", formData);
    const {
      eventName,
      about,
      guidelines,
      eventType,
      fromDate,
      toDate,
      emails,
      contactNumbers,
      isPaidEvent,
      price,
      deadline,
      details,
      website,
      registrationUrl,
      imagesKeys,
      backendImages,
    } = formData;

    if (
      !eventName.trim() ||
      !about.trim() ||
      !eventType.trim() ||
      !fromDate.trim() ||
      !toDate.trim() ||
      !deadline.trim() ||
      guidelines.some((g) => !g.trim()) ||
      emails.some((email) => !email.trim()) ||
      contactNumbers.some((number) => !number.trim())
    ) {
      return handleError("Please fill in all required fields!");
    }

    // Add this check in the validation section
    if (
      (!backendImages || backendImages.length === 0) &&
      (!formData.selectedFiles || formData.selectedFiles.length === 0)
    ) {
      return handleError("Please upload at least one image!");
    }

    if (formData.selectedFiles.length > 1) {
      return handleError("You can upload a maximum of 1 image");
    }

    //add this to check docs validation
    if (!formData.selectedDocs || formData.selectedDocs.length === 0) {
      return handleError("Please upload at least one Document!");
    }

    if (formData.selectedDocs.length > 1) {
      return handleError("You can upload a maximum of 1 Document");
    }

    // Convert dates to ISO format
    const fromISO = new Date(formData.fromDate).toISOString();
    const toISO = new Date(formData.toDate).toISOString();
    const currentDate = new Date().toISOString();

    if (fromISO < currentDate || toISO < currentDate) {
      return handleError("Event dates cannot be in the past!");
    }

    if (fromISO > toISO) {
      return handleError("Event start date cannot be later than the end date!");
    }

    if (new Date(deadline).toISOString() >= toISO) {
      return handleError(
        "Registration deadline must be earlier than the event end date!"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(
      (email) => !emailRegex.test(email.trim())
    );
    if (invalidEmails.length > 0) {
      return handleError(`Invalid email(s): ${invalidEmails.join(", ")}`);
    }

    const phoneRegex = /^\d{10}$/;
    const invalidNumbers = contactNumbers.filter(
      (number) => !phoneRegex.test(number.trim())
    );
    if (invalidNumbers.length > 0) {
      return handleError(
        `Invalid phone number(s): ${invalidNumbers.join(", ")}`
      );
    }

    if (details.length === 0) {
      return handleError(`Details should not be empty`);
    }

    for (const [index, detail] of details.entries()) {
      if (!detail.name.trim() || !detail.about.trim()) {
        return handleError(
          `Sub Event ${index + 1} is missing required fields!`
        );
      }

      if (!detail.from.trim() || !detail.to.trim()) {
        return handleError(`Sub Event ${index + 1} must have valid dates!`);
      }
      const subEventFromDate = new Date(detail.from).toISOString();
      const subEventToDate = new Date(detail.to).toISOString();

      if (subEventFromDate < currentDate || subEventToDate < currentDate) {
        return handleError(
          `Sub Event ${index + 1} dates cannot be in the past!`
        );
      }
      if (subEventFromDate > subEventToDate) {
        return handleError(
          `Sub Event ${index + 1} start date cannot be later than its end date!`
        );
      }

      if (subEventFromDate < fromISO || subEventToDate > toISO) {
        return handleError(
          `Sub Event ${
            index + 1
          }'s dates must be within the range of the main event dates!`
        );
      }

      if (detail.type === "OFFLINE") {
        if (
          !detail.venue ||
          !detail.venue.name.trim() ||
          !detail.venue.mapUrl.trim()
        ) {
          return handleError(
            `Sub Event ${
              index + 1
            } is marked as OFFLINE but does not have complete venue details!`
          );
        }
      }

      for (let otherIndex = 0; otherIndex < details.length; otherIndex++) {
        if (otherIndex !== index) {
          const otherDetailFrom = new Date(
            details[otherIndex].from
          ).toISOString();
          const otherDetailTo = new Date(details[otherIndex].to).toISOString();

          if (
            (subEventFromDate >= otherDetailFrom &&
              subEventFromDate < otherDetailTo) ||
            (subEventToDate > otherDetailFrom &&
              subEventToDate <= otherDetailTo) ||
            (subEventFromDate <= otherDetailFrom &&
              subEventToDate >= otherDetailTo)
          ) {
            return handleError(
              `Sub Event ${index + 1} conflicts with Sub Event ${
                otherIndex + 1
              }. Dates and times should not overlap!`
            );
          }
        }
      }
    }

    if (isPaidEvent) {
      if (!price || isNaN(price) || price <= 0) {
        return handleError(
          "Price is required and must be a valid positive number for paid events!"
        );
      }

      if (!website || !website.trim()) {
        return handleError("Website URL is required for paid events!");
      }

      if (!registrationUrl || !registrationUrl.trim()) {
        return handleError("Registration URL is required for paid events!");
      }
    }

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name", eventName);
    formDataToSend.append("about", about);
    formDataToSend.append("websiteUrl", website || "");
    formDataToSend.append("registrationUrl", registrationUrl || "");

    formDataToSend.append("price", isPaidEvent ? String(price) : "0");
    formDataToSend.append("from", fromISO);
    formDataToSend.append("to", toISO);
    formDataToSend.append("paid", isPaidEvent.toString());
    formDataToSend.append(
      "deadline",
      new Date(formData.deadline).toISOString()
    );

    const validEmails = formData.emails.filter((email) => email.trim());
    const validGuidelines = formData.guidelines.filter((g) => g.trim());
    const validContactNumbers = formData.contactNumbers.filter((n) => n.trim());

    validEmails.forEach((email, index) => {
      formDataToSend.append(`emails[${index}]`, email);
    });
    validGuidelines.forEach((g, index) =>
      formDataToSend.append(`guidlines[${index}]`, g)
    );
    validContactNumbers.forEach((n, index) =>
      formDataToSend.append(`phoneNumbers[${index}]`, n)
    );

    const formattedDetails = formData.details.map((detail) => ({
      ...detail,
      from: new Date(detail.from).toISOString(),
      to: new Date(detail.to).toISOString(),
      venue: detail.type === "ONLINE" ? { name: "", mapUrl: "" } : detail.venue,
    }));

    formDataToSend.append("details", JSON.stringify(formattedDetails));
    formData.selectedFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });
    formData.selectedDocs.forEach((file) => {
      formDataToSend.append("pdf", file);
    });

    if (isEditing && imagesKeys && imagesKeys.length > 0) {
      formData.imagesKeys?.forEach((key, index) => {
        formDataToSend.append(`imagesKeys[${index}]`, key);
      });
    }

    // Show loader toast
    const toastId = toast.loading("Submitting form...");

    try {
      if (isEditing) {
        await updateEvent(id, formDataToSend);
      } else {
        await CreateEvent(formDataToSend);
      }

      toast.dismiss(toastId);
      toast.success(
        isEditing ? "Event Updated successfully!" : "Event Added successfully!"
      );

      navigate("/admin-dashboard");

      // console.log("Response:", response);
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error:", error);

      return handleError("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (message: string) => {
    setIsSubmitting(false);
    toast.error(message);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* <Sidebar /> */}
      <main className="min-h-screen bg-gray-100 flex justify-center items-center px-6 lg:px-16 py-8">
        <div className="w-full max-w-5xl p-8 lg:p-12">
          <div className=" w-full flex items-center justify-between bg-gray-500 p-6 lg:p-8 rounded-t-lg ">
            <button
              type="button"
              className="flex items-center text-white font-semibold hover:text-black transition-all duration-300 focus:outline-none"
              onClick={() => {
                navigate("/admin-dashboard");
              }}
            >
              <MdArrowBack className="mr-2" size={24} />
              Back
            </button>

            <h1 className="text-3xl font-bold text-white">
              {isEditing ? " Update Your Event" : " Add New Event"}
            </h1>
          </div>
          {/* Form Section */}
          <div className="bg-white shadow-lg rounded-b-lg p-6 lg:p-8">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </div>
              <div className="bg-gray-100 w-full flex flex-col justify-center gap-3 p-6 rounded-md">
                {/* Event Name */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-gray-700 text-sm font-bold"
                    htmlFor="eventName"
                  >
                    Event Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    placeholder="Enter event name"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                {/* Event Images */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-bold">
                    Event Images <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("eventImages")?.click()
                      }
                      className="bg-blue-500 flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                      <MdOutlineFileUpload size={20} />{" "}
                      <span>Upload Images</span>
                    </button>
                    <span className="text-gray-500 text-sm">
                      (You can upload a maximum of 1 image of ideally 1X1
                      ratio.)
                    </span>
                  </div>
                  <input
                    type="file"
                    id="eventImages"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                  />

                  {/* Display Backend Images */}
                  {formData?.backendImages &&
                    formData.backendImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-700 text-sm font-semibold">
                          Existing Images:
                        </p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {formData.backendImages?.map((image, index) => (
                            <div
                              key={image.key}
                              className="relative border rounded-lg overflow-hidden group"
                            >
                              <img
                                src={image.url}
                                alt={`Backend Image ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index, true)}
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                                aria-label="Remove backend image"
                              >
                                <MdDelete size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Display Newly Uploaded Images */}
                  {formData.selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-700 text-sm font-semibold">
                        Newly Uploaded Images:
                      </p>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {formData.selectedFiles.map((file, index) => {
                          const previewUrl = URL.createObjectURL(file);
                          return (
                            <div
                              key={index}
                              className="relative border rounded-lg overflow-hidden group"
                            >
                              <img
                                src={previewUrl}
                                alt={`Uploaded Image ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  handleRemoveImage(index, false);
                                  URL.revokeObjectURL(previewUrl); // Revoke URL to free memory
                                }}
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                                aria-label="Remove uploaded image"
                              >
                                <MdDelete size={18} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* About */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-gray-700 text-sm font-bold"
                    htmlFor="about"
                  >
                    About <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="about"
                    rows={4}
                    placeholder="Enter event description"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Guidelines Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-bold">
                    Guidelines <span className="text-red-500 ml-1">*</span>
                  </label>
                  {formData.guidelines.map((guideline, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={guideline}
                        onChange={(e) =>
                          handleGuidelineChange(index, e.target.value)
                        }
                        placeholder={`Guideline ${index + 1}`}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGuideline(index)}
                          className="p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
                          aria-label="Delete guideline"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div
                    onClick={handleAddGuideline}
                    className="inline-flex items-center gap-1.5 text-blue-500 hover:text-violet-400 cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    <CiCirclePlus size={24} />
                    <span className="text-sm font-medium">
                      Add Another Guideline
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Information
              </div>
              <div className="bg-gray-100 w-full flex flex-col justify-center gap-3 p-6 rounded-md">
                {/* Emails Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-bold">
                    Emails <span className="text-red-500 ml-1">*</span>
                  </label>
                  {formData.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                        placeholder={`Email ${index + 1}`}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(index)}
                          className="p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
                          aria-label="Delete guideline"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      )}
                    </div>
                  ))}

                  <div
                    onClick={handleAddEmail}
                    className="inline-flex items-center gap-1.5 text-blue-500 hover:text-violet-400 cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    <CiCirclePlus size={24} />
                    <span className="text-sm font-medium">Add Email</span>
                  </div>
                </div>

                {/* Contact Numbers Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-bold">
                    Contact Numbers <span className="text-red-500 ml-1">*</span>
                  </label>
                  {formData.contactNumbers.map((contact, index) => {
                    // Split the contact string into countryCode and number parts
                    const [countryCode, number] = contact.split("-");

                    return (
                      <div key={index} className="flex items-center gap-2">
                        {/* Country Code Input */}
                        <input
                          type="number"
                          value={countryCode || ""}
                          onChange={(e) => {
                            const updatedContact = `${e.target.value}-${
                              number || ""
                            }`;
                            handleContactNumberChange(index, updatedContact);
                          }}
                          placeholder="+91"
                          className="w-20 border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                        />

                        {/* Contact Number Input */}
                        <input
                          type="number"
                          value={number || ""}
                          onChange={(e) => {
                            const updatedContact = `${countryCode || ""}-${
                              e.target.value
                            }`;
                            handleContactNumberChange(index, updatedContact);
                          }}
                          placeholder={`Contact Number ${index + 1}`}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                        />

                        {/* Delete Button */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveContactNumber(index)}
                            className="p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
                            aria-label="Delete Contact Number"
                          >
                            <AiOutlineDelete size={20} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {/* Add Contact Number Button */}
                  <div
                    onClick={handleAddContactNumber}
                    className="inline-flex items-center gap-1.5 text-blue-500 hover:text-violet-400 cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    <CiCirclePlus size={24} />
                    <span className="text-sm font-medium">
                      Add Contact Number
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Event Details
              </div>
              <div className="bg-gray-100 w-full flex flex-col justify-center gap-3 p-6 rounded-md">
                {/* Event Dates */}
                <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                  <div className="flex flex-col gap-2 flex-grow">
                    <label
                      className="text-gray-700 text-sm font-bold"
                      htmlFor="fromDate"
                    >
                      From <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="fromDate"
                      value={formData.fromDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    <label
                      className="text-gray-700 text-sm font-bold"
                      htmlFor="toDate"
                    >
                      To <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="toDate"
                      value={formData.toDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Check for team size */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-gray-700 text-sm font-bold"
                    htmlFor="teamSize"
                  >
                    Team Size <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    placeholder="Enter team size"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>

                {/* Paid Event Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPaidEvent"
                    checked={formData.isPaidEvent}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                  <label
                    htmlFor="isPaidEvent"
                    className="text-gray-700 font-bold"
                  >
                    Is this a paid event?
                  </label>
                </div>

                {/* Price and Deadline */}
                <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                  {/* Conditional Price Input */}
                  {formData.isPaidEvent && (
                    <div className="flex flex-col gap-2 flex-grow">
                      <label
                        className="text-gray-700 text-sm font-bold"
                        htmlFor="price"
                      >
                        Price <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 flex-grow">
                    <label
                      className="text-gray-700 text-sm font-bold"
                      htmlFor="participantCount"
                    >
                      Registration Deadline{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      placeholder="Enter  Registration Deadline  "
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                </div>
                {formData.isPaidEvent && (
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-gray-700 text-sm font-bold"
                      htmlFor="registrationUrl"
                    >
                      Registration URL{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="url"
                      id="registrationUrl"
                      value={formData.registrationUrl}
                      onChange={handleInputChange}
                      placeholder="Enter registration URL"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                )}

                {/* Check for outside participants */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOutsideParticipantsAllowed"
                    checked={formData.isOutsideParticipantsAllowed}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                  <label
                    htmlFor="isOutsideParticipantsAllowed"
                    className="text-gray-700 font-bold"
                  >
                    Is outside participants allowed?
                  </label>
                </div>

                {/* Event tags */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-bold">
                    Event Tags
                  </label>

                  {/* Select dropdown for event tags */}
                  <select
                    value={formData.eventTags}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        eventTags: e.target.value,
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="">Select an event tag</option>{" "}
                    {availableTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Website */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-gray-700 text-sm font-bold"
                    htmlFor="website"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    placeholder="Enter website URL"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Sub Event Details
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isoneday"
                  checked={oneDay}
                  onChange={(e) => handleOneDayEvent(e)}
                  className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                <label htmlFor="isOneDay" className="text-gray-700 font-bold">
                  Is this one day event?
                </label>
              </div>
              {/* Details Section */}
              {formData.details.map((detail, index) => (
                <div key={index}>
                  <div className="bg-gray-100 w-full flex flex-col justify-center gap-3 p-6 rounded-md">
                    <div className="flex flex-col gap-4 relative">
                      {formData.details.length > 1 && index !== 0 && (
                        <button
                          type="button"
                          onClick={() => confirmDelete(index)}
                          className="absolute top-2 right-2 p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
                          aria-label="Delete guideline"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      )}
                      <h4 className="text-gray-700 text-lg font-bold">
                        Details{" "}
                        {!oneDay && <span>(Sub Event {index + 1})</span>}
                      </h4>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-bold">
                          Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={`Enter name for Sub Event ${index + 1}`}
                          value={detail.name}
                          onChange={(e) =>
                            handleDetailFieldChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-bold">
                          About <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                          placeholder={`Enter description for Sub Event ${
                            index + 1
                          }`}
                          value={detail.about}
                          onChange={(e) =>
                            handleDetailFieldChange(
                              index,
                              "about",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
                        ></textarea>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-bold">
                          From <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={detail.from}
                          onChange={(e) =>
                            handleDetailFieldChange(
                              index,
                              "from",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-bold">
                          To <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={detail.to}
                          onChange={(e) =>
                            handleDetailFieldChange(index, "to", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-bold">
                          Type <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          value={detail.type}
                          onChange={(e) =>
                            handleDetailFieldChange(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                        >
                          <option value="ONLINE">ONLINE</option>
                          <option value="OFFLINE">OFFLINE</option>
                        </select>
                      </div>
                      {detail.type === "OFFLINE" && (
                        <>
                          <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Venue Details (Sub Event {index + 1})
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-bold">
                              Venue Name{" "}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter venue name for Sub Event ${
                                index + 1
                              }`}
                              value={detail.venue.name}
                              onChange={(e) =>
                                handleDetailFieldChange(
                                  index,
                                  "venue",
                                  e.target.value,
                                  "name"
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-bold">
                              Embedded Venue Map URL{" "}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter venue map URL for Sub Event ${
                                index + 1
                              }`}
                              value={detail.venue.mapUrl}
                              onChange={(e) =>
                                handleDetailFieldChange(
                                  index,
                                  "venue",
                                  e.target.value,
                                  "mapUrl"
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                          </div>
                          {detail.venue.mapUrl && (
                            <div className="mt-4">
                              <label className="text-gray-600 text-sm font-semibold">
                                Map Preview:
                              </label>
                              <iframe
                                src={detail.venue.mapUrl}
                                title={`Map Preview for Sub Event ${index + 1}`}
                                className="w-full h-64 border border-gray-300 rounded-lg mt-2"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div
                onClick={addSubEvent}
                className="inline-flex items-center gap-1.5 text-blue-500 hover:text-violet-400 cursor-pointer transition-all duration-300 ease-in-out"
              >
                <CiCirclePlus size={24} />
                <span className="text-sm font-medium">Add More Sub-Event</span>
              </div>

              {/* Add No Objection Document */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("nocDocument")?.click()
                  }
                  className="bg-blue-500 flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <MdOutlineFileUpload size={20} /> <span>Upload Document</span>
                </button>
                <span className="text-gray-500 text-sm">
                  (Upload No Objection Document.)
                </span>
              </div>

              <input
                type="file"
                id="nocDocument"
                accept=".pdf"
                className="hidden"
                multiple
                onChange={(e) => handleDocChange(e)}
              />

              {formData.selectedDocs.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-700 text-sm font-semibold">
                    Newly Uploaded Files:
                  </p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.selectedDocs.map((file, index) => {
                      return (
                        <div
                          key={index}
                          className="relative border rounded-lg p-4 bg-gray-50 hover:shadow-lg transition-all duration-200"
                        >
                          <p className="text-sm text-gray-800 font-medium truncate">
                            {file.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(index)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                            aria-label="Remove uploaded file"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Confirmation Modal */}
              <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => {
                  if (deleteIndex !== null) {
                    removeSubEvent(deleteIndex);
                  }
                }}
                message="This action cannot be undone. Do you want to proceed?"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className={` ${
                  isSubmitting ? "bg-gray-600" : "bg-blue-500"
                } w-full  text-white font-bold py-2.5 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 duration-300`}
                disabled={isSubmitting}
              >
                {isEditing ? " Update Event" : " Add  Event"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddEvent;
