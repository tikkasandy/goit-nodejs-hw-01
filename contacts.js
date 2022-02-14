const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath);

        const contacts = JSON.parse(data);

        return contacts;
    } catch (err) {
        console.log(err.message);
        return [];
    }

}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find(el => el.id === contactId);

    if (!contact) {
        return null;
    }

    return contact;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const idx = contacts.findIndex(el => el.id === contactId);

    if (idx === -1) {
        return null;
    }

    const newContacts = contacts.filter((_, index) => index !== idx);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));

    return contacts[idx];
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = { id: v4(), name, email, phone };

    await fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact]));

    return newContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}