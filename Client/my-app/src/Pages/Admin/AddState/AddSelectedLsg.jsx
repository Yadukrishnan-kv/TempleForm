import React, { useEffect, useState, useMemo } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./AddState.css";
import { toast } from "react-toastify";

function AddSelectedLsg() {
  const ip = process.env.REACT_APP_BACKEND_IP;

  const [name, setName] = useState("");
  const [lsg, setSelectedLsg] = useState("");
  const [Taluk, setTaluk] = useState("");

  const [taluks, setTaluks] = useState([]);
  const [lsgs, setLsgs] = useState([]);
  const [selectedLsgs, setSelectedLsgs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLsgId, setEditingLsgId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`${ip}/api/taluks/getAllTaluks`)
      .then((res) => setTaluks(res.data))
      .catch((err) => console.error("Error fetching taluks:", err));
  }, [ip]);

  useEffect(() => {
    axios
      .get(`${ip}/api/lsg/getAllLsgs`)
      .then((res) => setLsgs(res.data))
      .catch((err) => console.error("Error fetching LSGs:", err));
  }, [ip]);

  useEffect(() => {
    axios
      .get(`${ip}/api/SelectedLsg/getAllSelectedLsgs`)
      .then((res) => setSelectedLsgs(res.data))
      .catch((err) => console.error("Error fetching selected lsgs:", err));
  }, [ip]);

  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: "Master",
          subModule: "Manage Selected LSGs",
          details,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedLsg("");
    setTaluk("");
    setIsEditing(false);
    setIsFormVisible(false);
    setEditingLsgId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedTaluk = taluks?.find((t) => t._id === Taluk);
    const selectedlsg = lsgs?.find((l) => l._id === lsg);
   

    const payload = {
      name,
      lsg: selectedlsg.name,
      Taluk: selectedTaluk.name,
    };

    if (isEditing) {
      axios
        .put(`${ip}/api/SelectedLsg/updateSelectedLsg/${editingLsgId}`, payload)
        .then((res) => {
          setSelectedLsgs((prev) =>
            prev.map((item) =>
              item._id === editingLsgId
                ? { ...res.data, taluk: selectedTaluk }
                : item
            )
          );
          toast.success("Selected LSG updated!");
          logAction("Update", `Updated Selected LSG: ${name}`);
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error updating Selected LSG");
        });
    } else {
      axios
        .post(`${ip}/api/SelectedLsg/createSelectedLsg`, payload)
        .then((res) => {
          const newLsg = { ...res.data, taluk: selectedTaluk };
          setSelectedLsgs([...selectedLsgs, newLsg]);
          toast.success("Selected LSG created!");
          logAction("Create", `Created Selected LSG: ${name}`);
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error creating Selected LSG");
        });
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setSelectedLsg(item.lsg?._id || ""); // ✅ correct
    setTaluk(item.taluk?._id || "");
    setIsEditing(true);
    setIsFormVisible(true);
    setEditingLsgId(item._id);
  };

  const handleDelete = (id, name) => {
    axios
      .delete(`${ip}/api/SelectedLsg/deleteSelectedLsg/${id}`)
      .then(() => {
        setSelectedLsgs((prev) => prev.filter((item) => item._id !== id));
        toast.success("Selected LSG deleted!");
        logAction("Delete", `Deleted Selected LSG: ${name}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error deleting Selected LSG");
      });
  };

  // const lsgMap = useMemo(() => {
  //   const map = {};
  //   lsgs.forEach(lsg => {
  //     map[lsg._id] = lsg.name;
  //   });
  //   return map;
  // }, [lsgs]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = selectedLsgs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(selectedLsgs.length / itemsPerPage);

  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Statesubmission-page">
          <h2>Manage Selected LSGs</h2>
          <button
            className="add-button"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible
              ? "Cancel"
              : isEditing
              ? "Edit Selected LSG"
              : "Add New Selected LSG"}
          </button>

          {isFormVisible && (
            <form className="state-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="LSG Name"
                required
              />

              <select
                value={lsg}
                onChange={(e) => setSelectedLsg(e.target.value)}
                required
              >
                <option value="">Select LSG</option>
                {lsgs.map((lsg) => (
                  <option key={lsg._id} value={lsg._id}>
                    {lsg.name}
                  </option>
                ))}
              </select>

              <select
                value={Taluk}
                onChange={(e) => setTaluk(e.target.value)}
                required
              >
                <option value="">Select Taluk</option>
                {taluks.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>
          )}

          <div className="state-list">
            <h2>Selected LSG List</h2>
            <table className="taluk-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Selected LSG</th>
                  <th>Taluk</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.lsg}</td>
                    <td>{item.Taluk}</td>
                    <td>
                      <button
                        className="edit-link"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-button1"
                        onClick={() => handleDelete(item._id, item.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSelectedLsg;
