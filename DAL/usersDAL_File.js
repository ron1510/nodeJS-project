const jsonfile = require('jsonfile');

const file = './userTrackers/usersData.json';

// read from a json file
const getUsers = async () => {
  return await jsonfile.readFile(file);
};

// write to a json file
const setUsers = async (obj) => {
  await jsonfile.writeFile(file, obj);
  return 'Done';
};


const getLastActionById = async (id) => {
  const {actions :users} = await getUsers()
  reversedUsers = users.reverse();
  return reversedUsers.find(user => user.id === id)
}

module.exports = { getUsers, setUsers, getLastActionById };