import React, { useState, useEffect } from "react";

const AvailableHostels = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ফিল্টার স্টেট
  const [filters, setFilters] = useState({
    seatCapacity: "",
    isAcAvailable: false,
    isAttachedBathroomAvailable: "",
    isBalconyAvailable: ""
  });

  // ডাটা ফেচ করার ফাংশন
  const fetchRooms = async () => {
    setLoading(true);
    try {
      // কোয়েরি প্যারামিটার তৈরি করা
      const queryParams = new URLSearchParams();
      if (filters.seatCapacity) queryParams.append("SeatCapacity", filters.seatCapacity);
      if (filters.isAcAvailable) queryParams.append("IsAcAvailable", filters.isAcAvailable);
      if (filters.isAttachedBathroomAvailable !== "") 
        queryParams.append("IsAttachedBathroomAvailable", filters.isAttachedBathroomAvailable);
      if (filters.isBalconyAvailable !== "") 
        queryParams.append("IsBalconyAvailable", filters.isBalconyAvailable);

      const response = await fetch(`http://localhost:5091/api/hostels/search-rooms?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setRooms(result.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // প্রথমবার পেজ লোড হলে সব এভেইলঅ্যাবল রুম দেখাবে
  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">খালি রুম খুঁজুন</h2>

        {/* ফিল্টার সেকশন */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">সিট সংখ্যা</label>
            <input
              type="number"
              name="seatCapacity"
              value={filters.seatCapacity}
              onChange={handleFilterChange}
              placeholder="উদা: 2"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">সংযুক্ত বাথরুম?</label>
            <select
              name="isAttachedBathroomAvailable"
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">সব</option>
              <option value="1">হ্যাঁ</option>
              <option value="0">না</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pb-3">
            <input
              type="checkbox"
              name="isAcAvailable"
              id="ac"
              checked={filters.isAcAvailable}
              onChange={handleFilterChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="ac" className="text-sm font-medium text-gray-700">এসি (AC) রুম</label>
          </div>

          <button
            onClick={fetchRooms}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition active:scale-95"
          >
            সার্চ করুন
          </button>
        </div>

        {/* রেজাল্ট সেকশন */}
        {loading ? (
          <p className="text-center text-blue-600 font-medium">লোডিং হচ্ছে...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-2xl shadow-md p-5 border border-blue-50 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">রুম নং: {room.roomNumber}</h3>
                      <p className="text-sm text-blue-600 font-medium">{room.hostelName}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {room.seatAvailable} সিট খালি
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>🏢 ফ্লোর: {room.floorNo}</p>
                    <p>👥 মোট সিট: {room.seatCapacity}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {room.isAcAvailable && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">❄️ AC</span>
                      )}
                      {room.isAttachedBathroomAvailable === 1 && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold">🚿 Attached Bath</span>
                      )}
                      {room.isBalconyAvailable === 1 && (
                        <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-semibold">🌅 Balcony</span>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full mt-5 bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition">
                    বিস্তারিত দেখুন
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500">দুঃখিত, এই ফিল্টার অনুযায়ী কোনো রুম পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableHostels;