import { useState } from "react";
import SEO from "../seo/SEO";

export default function SubmitConference() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    setError("");

    const form = e.target;
    const formData = new FormData(form);

    const startDate = new Date(formData.get("event_start_date"));
    const endDate = new Date(formData.get("event_end_date"));
    const regDeadline = new Date(formData.get("registration_deadline"));
    const absDeadline = new Date(formData.get("abstract_deadline"));

    if (endDate < startDate) {
      setError("Event end date cannot be earlier than start date.");
      setStatus("");
      return;
    }

    if (
      (formData.get("registration_deadline") && regDeadline > startDate) ||
      (formData.get("abstract_deadline") && absDeadline > startDate)
    ) {
      setError(
        "Registration or abstract deadline cannot be after the event start date."
      );
      setStatus("");
      return;
    }

    formData.append("access_key", "638d5af6-e960-4187-bf04-2532f11176af");
    formData.append(
      "subject",
      "New Conference Submission | AllConferenceAlerts"
    );
    formData.append("from_name", "AllConferenceAlerts");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setShowPopup(true);
        form.reset();
      } else {
        setError("Submission failed. Please try again.");
        setStatus("");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
      setStatus("");
    }
  };

  return (
    <>
      <SEO
        title="Submit Conference | Promote International Conferences Globally"
        description="Submit your academic or industry conference to AllConferenceAlerts and reach global researchers, professionals, and institutions worldwide."
        canonical="https://www.allconferencealerts.net/submit-conference"
      />

      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">
          Submit Your Conference
        </h1>

        <p className="text-gray-600 max-w-3xl mb-10">
          List your international academic or industry conference on
          <strong> AllConferenceAlerts</strong> and gain high-quality global
          visibility among researchers, academicians, and professionals.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl shadow-sm p-8 space-y-6"
        >
          <input
            type="text"
            name="conference_title"
            placeholder="Conference Title *"
            required
            className="w-full border rounded-md px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <select
              name="category"
              required
              className="border rounded-md px-4 py-3"
            >
              <option value="">Select Category *</option>
              <option>Engineering</option>
              <option>Medical</option>
              <option>Business</option>
              <option>Technology</option>
              <option>Environmental</option>
              <option>Life Science</option>
            </select>

            <select
              name="event_mode"
              required
              className="border rounded-md px-4 py-3"
            >
              <option value="">Event Mode *</option>
              <option>Virtual</option>
              <option>Hybrid</option>
              <option>Physical</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <select
              name="country"
              required
              className="border rounded-md px-4 py-3"
            >
              <option value="">Select Country *</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>

            <input
              type="text"
              name="city"
              placeholder="City"
              className="border rounded-md px-4 py-3"
            />
          </div>

          <input
            type="url"
            name="website"
            placeholder="Official Conference Website *"
            required
            className="w-full border rounded-md px-4 py-3"
          />

          {/* DATE FIELDS WITH LABELS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Start Date *
              </label>
              <input
                type="date"
                name="event_start_date"
                required
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Event End Date *
              </label>
              <input
                type="date"
                name="event_end_date"
                required
                className="w-full border rounded-md px-4 py-3"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Registration Deadline
              </label>
              <input
                type="date"
                name="registration_deadline"
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Abstract Submission Deadline
              </label>
              <input
                type="date"
                name="abstract_deadline"
                className="w-full border rounded-md px-4 py-3"
              />
            </div>
          </div>

          <input
            type="text"
            name="organizer"
            placeholder="Organizing Institution / Society *"
            required
            className="w-full border rounded-md px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="contact_person"
              placeholder="Contact Person *"
              required
              className="border rounded-md px-4 py-3"
            />
            <input
              type="email"
              name="contact_email"
              placeholder="Contact Email *"
              required
              className="border rounded-md px-4 py-3"
            />
          </div>

          <textarea
            rows="5"
            name="description"
            placeholder="Short Conference Description *"
            required
            className="w-full border rounded-md px-4 py-3"
          />

          <button
            type="submit"
            className="bg-primary text-white px-10 py-3 rounded-full font-semibold hover:bg-teal-700 transition"
          >
            Submit Conference
          </button>

          {error && (
            <p className="text-red-600 font-medium">{error}</p>
          )}
        </form>
      </main>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              🎉 Submission Successful
            </h3>

            <p className="text-gray-700 mb-3">
              Thank you for submitting your conference to
              <strong> AllConferenceAlerts</strong>.
            </p>

            <p className="text-gray-700 mb-4">
              Our editorial team will review your submission and contact you
              shortly. For priority communication, please reach us at
              <strong> info@allconferencealerts.net</strong>.
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
