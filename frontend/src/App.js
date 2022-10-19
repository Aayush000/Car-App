import React, { useEffect, useState } from "react";
import "./App.css";

// Initial Car Details
const carFormInitialData = {
  id: null,
  brand: "",
  name: "",
  releaseYear: "",
  color: "",
};

function Cars() {
  // Statte that stores the carFormData.
  const [carFormData, setCarFormData] = useState(carFormInitialData);
  // State that store the list of Cars.
  const [carList, setCarList] = useState([]);
  // State that refresh the page and update the page with new information.
  const [refresh, setRefresh] = useState(false);

  const handleInputChange = (e) => {
    const { name, brand, releaseYear, color, value } = e.target;
    setCarFormData({
      ...carFormData,
      [name]: value,
      [brand]: value,
      [releaseYear]: value,
      [color]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let submit = document.getElementById("submit");

    if (submit.value == "Update") {
      handleEdit(event);
    } else {
      handlePost(event);
    }
    event.target.reset();
  };

  const handlePost = async (event) => {
    let res = await fetch("http://localhost:3002/save", {
      method: "POST",
      body: JSON.stringify({
        name: event.target.name.value,
        id: event.target.id.value,
        brand: event.target.brand.value,
        releaseYear: event.target.releaseYear.value,
        color: event.target.color.value,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => setRefresh(!refresh));
  };

  const handleDelete = async (event) => {
    let res = await fetch("http:/localhost:3002/delete", {
      method: "DELETE",
      body: JSON.stringify({
        id: event.target.parentElement.id,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => setRefresh(!refresh));
  };

  /** 🥳🥳🥳🥳🥳🥳 DOUBLE BONUS POINTS 🥳🥳🥳🥳🥳🥳 */
  const handleEdit = async (event) => {
    /**
     * When clicked on a edit button figure out a way to edit the car data.
     * Once edited send the updated data to NodeJS.
     * Then use javascript fetch to send DELETE request to NodeJS
     * https://openjavascript.info/2022/01/03/using-fetch-to-make-get-post-put-and-delete-requests/
     */
    event.preventDefault();
    let id = document.getElementById("id");
    let name = document.getElementById("name");
    let brand = document.getElementById("brand");
    let releaseYear = document.getElementById("releaseYear");
    let color = document.getElementById("color");
    let submit = document.getElementById("submit");
    submit.value = "Update";

    id.value = event.target.parentElement.getAttribute("id");
    name.value = event.target.parentElement.getAttribute("name");
    brand.value = event.target.parentElement.getAttribute("brand");
    releaseYear.value = event.target.parentElement.getAttribute("releaseYear");
    color.value = event.target.parentElement.getAttribute("color");
  };

  useEffect(() => {
    fetch("http://localhost:3002/carsList")
      .then((res) => res.json())
      .then((result) => {
        setCarList(result);
      });
  }, [refresh]);

  return (
    <div className="cars-from-wrapper">
      <form id="cars-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          ID:
          <input
            name="id"
            type="text"
            value={carFormData.id}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={carFormData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Brand:
          <input
            name="brand"
            type="text"
            value={carFormData.brand}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Release Year:
          <input
            name="releaseYear"
            type="text"
            value={carFormData.releaseYear}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Color:
          <input
            name="color"
            type="text"
            value={carFormData.color}
            onChange={handleInputChange}
          />
        </label>
        <input type="submit" value="Submit" id="submit" />
      </form>

      <p>
        ID:{carFormData.id} --- Name:{carFormData.name} --- Brand:
        {carFormData.brand} --- Relese Year: {carFormData.releaseYear} ---
        Color: {carFormData.color}
      </p>

      <h2>Cars Data</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Make</th>
            <th>Car Model</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {carList.map((car) => {
            return (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.name}</td>
                <td>{car.brand}</td>
                <td
                  id={car.id}
                  name={car.name}
                  brand={car.brand}
                  releaseYear={car.releaseYear}
                  color={car.color}
                  onClick={handleEdit}
                >
                  ✎
                </td>
                <td
                  id={car.id}
                  name={car.name}
                  brand={car.brand}
                  releaseYear={car.releaseYear}
                  color={car.color}
                  onClick={handleDelete}
                >
                  🗑
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Cars;
