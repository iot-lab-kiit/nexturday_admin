const ProfilePage = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
        {/* Container for the profile page */}
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
          {/* Left Section: Admin Info */}
          <div className="md:w-1/3 flex flex-col items-center border-r pr-6">
            {/* Profile Image and Edit Icon */}
            <div className="relative flex items-center justify-center w-28 h-28 mb-4">
              <img
                src="/images/adminProfile.jpg"
                alt="Profile"
                className="w-full h-full rounded-full border border-gray-300 shadow-sm"
              />
              {/* Edit icon positioned at the bottom-right of the profile image */}
              <img
                src="/icons/edit.png"
                alt="Edit"
                className="absolute bottom-1 right-1 w-7 h-7 bg-white p-1 rounded-full border cursor-pointer hover:shadow-md hover:bg-gray-50"
              />
            </div>
            {/* Admin Name and Description */}
            <h2 className="text-2xl font-bold text-gray-800">Society Name</h2>
            <p className="text-gray-600 text-center mt-2 px-2">
              This is a brief description about the society. It can be 2-3 lines long.
            </p>
          </div>
  
          {/* Right Section: Admin Details Form */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {/* Horizontal divider for smaller screens */}
            <hr className="md:hidden border-gray-300" />
            <form className="w-full flex flex-col gap-6">
              {/* Email Input Field */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="admin@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              {/* Password Input Field with Forgot Password Link */}
              <div className="flex items-center gap-4">
                <div className="flex-grow flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-bold" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="********"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>
                <button
                  className="text-blue-500 hover:underline text-sm flex items-center justify-center"
                  type="button"
                >
                  Forgot Password?
                </button>
              </div>
              {/* Website Input Field */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold" htmlFor="website">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  placeholder="https://societywebsite.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              {/* Contact Information Section */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-800">Contact</h3>
                <p className="text-gray-600">Phone 1: (123) 456-7890</p>
                <p className="text-gray-600">Phone 2: (098) 765-4321</p>
                <button
                  className="text-blue-500 hover:underline mt-2 self-start"
                  type="button"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;
  