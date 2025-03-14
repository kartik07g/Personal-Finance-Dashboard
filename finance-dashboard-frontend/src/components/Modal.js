import React, { useState, useEffect } from "react";
import "../styles/css/Modal.css";

const Modal = ({ title, fields, initialValues, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(initialValues || {});  
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} className="form-group">
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit" className="submit-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
