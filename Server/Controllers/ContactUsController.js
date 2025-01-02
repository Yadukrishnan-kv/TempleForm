const Contact = require('../Models/ContactUsModel');

const submitContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully', contact: newContact });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting form', error: error.message });
  }
};

 const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching contacts', error: error.message });
  }
};
module.exports={
  submitContact,getContacts
}