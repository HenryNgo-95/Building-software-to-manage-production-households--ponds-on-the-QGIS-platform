// URL API của bạn
const API_URL = "http://127.0.0.1:8081/api/stations"; // URL của proxy trong Spring Boot

// Nơi chứa danh sách các trạm
const stationList = document.getElementById("station-list");

// Hàm fetch dữ liệu từ API
async function fetchStations() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }

    const stations = await response.json();
    console.log("Fetched stations:", stations); // In dữ liệu để kiểm tra
    displayStations(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    stationList.innerHTML = "<p>Không thể tải dữ liệu các trạm quan trắc.</p>";
  }
}

// Hàm hiển thị danh sách các trạm
function displayStations(stations) {
  // Xóa nội dung cũ
  stationList.innerHTML = "";

  // Duyệt qua danh sách các trạm và tạo giao diện
  stations.forEach((station) => {
    const stationCard = document.createElement("div");
    stationCard.classList.add("station-card");

    // Lấy hình ảnh từ dữ liệu (nếu không có thì đặt ảnh mặc định)
    const imageUrl = station.historicalStations?.[0]?.thing?.imageUrl || 'https://via.placeholder.com/300x200';

    // Thêm nội dung trạm
    stationCard.innerHTML = `
      <img src="${imageUrl}" alt="${station.name}" />
      <h2>${station.name}</h2>
      <p><strong>Mô tả:</strong> ${station.description}</p>
      <p><strong>Node:</strong> ${station.node}</p>
      <p><strong>Trạng thái:</strong> ${station.historicalStations?.length > 0 ? 'Hoạt động' : 'Không hoạt động'}</p>
    `;

    // Thêm card vào danh sách
    stationList.appendChild(stationCard);
  });
}

// Gọi hàm fetch khi tải trang
fetchStations();


///////////////////////////////////////////// 
// Multi data streams
const MULTI_DATA_STREAMS_API = "http://127.0.0.1:8081/api/multi-data-streams"; // URL API của bạn

// Hàm fetch dữ liệu dòng dữ liệu từ API
async function fetchDataStreams() {
  try {
    const response = await fetch(MULTI_DATA_STREAMS_API);

    if (!response.ok) {
      throw new Error(`Failed to fetch data streams: ${response.statusText}`);
    }

    const dataStreams = await response.json(); // Dữ liệu JSON trả về từ API

    // Gọi hàm để hiển thị danh sách
    displayDataStreams(dataStreams);
  } catch (error) {
    console.error("Error fetching data streams:", error);
    document.getElementById("data-streams").innerHTML =
      "<p>Không thể tải dữ liệu các dòng dữ liệu.</p>";
  }
}

// Hàm hiển thị danh sách dòng dữ liệu
function displayDataStreams(dataStreams) {
  const dataStreamsList = document.getElementById("data-streams-list");

  dataStreamsList.innerHTML = ""; // Xóa nội dung cũ

  dataStreams.forEach((dataStream) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <strong>Tên dòng dữ liệu:</strong> ${dataStream.name} <br>
      <strong>Mô tả:</strong> ${dataStream.description} <br>
      <strong>Cảm biến:</strong> ${dataStream.sensor.name} (${dataStream.sensor.description}) <br>
      <strong>Trạm:</strong> ${dataStream.station.name} (${dataStream.station.description}) <br>
      <strong>Cấu hình:</strong> 
      <ul>
        <li>Độ phân giải: ${dataStream.configuration.resolution_bit} bit</li>
        <li>Chân analog: ${dataStream.configuration.analog_pin}</li>
        <li>Tham chiếu điện áp: ${dataStream.configuration.voltage_reference} V</li>
        <li>Hành động: ${dataStream.configuration.action}</li>
      </ul>
    `;

    dataStreamsList.appendChild(listItem);
  });
}

// Gọi hàm fetch khi trang tải
document.addEventListener("DOMContentLoaded", fetchDataStreams);
