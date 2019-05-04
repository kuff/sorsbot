const { admin_id } = require('../config.json');

module.exports = {

    notifyAdmin: (client, message) => {
        // TODO: make this work
        const adminMember = client.guilds.first().members.find(member => member.id == admin_id).first();
        if (!adminMember) return console.log('Unable to locate admin user!');
        console.log(message);
        adminMember.sendMessage(message);
    }

}