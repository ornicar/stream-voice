(async () => {
  const tmi = require('tmi.js');
  const fetch = require('node-fetch');
  const app = require('express')();
  const port = 9768;
  var user = {
    name: process.env.TWITCH_USER,
    id: 63245307,
    profilepic:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/2c6b728e-2572-43e8-b67d-405b14e1877c-profile_image-300x300.png',
  };
  // get on https://twitchapps.com/tmi/
  var apikey = process.env.TWITCH_APIKEY;
  var room = user.name;
  // console.log(apikey);

  if (!user.name || !apikey)
    throw new Error(`
You must set the TWITCH_USER and TWITCH_APIKEY environment variable
where TWITCH_USER is your Twitch username, and TWITCH_APIKEY is your OAuth key from
https://twitchapps.com/tmi/
`);

  var options = {
    options: {
      debug: true,
    },
    connection: {
      cluster: 'aws',
      reconnect: true,
      secure: true,
    },
    identity: {
      username: user.name,
      password: apikey,
    },
    channels: [user.name],
  };

  apikey = apikey.replace('oauth:', '');

  // console.log("Fetching data...");
  // await getUserData(user.name);
  // console.log("Data fetched!");
  // console.log('Getting rooms...');
  // await getRooms(user.id);
  // console.log('Got rooms!');

  var client = new tmi.client(options);
  client.connect().catch(e => console.log(e));

  client.on('connected', (address, port) => {
    console.log(`Connected to ${address}:${port}.`);
    console.log('Joining default room (main chat).');
    client.join(user.name);
  });
  client.on('error', e => {
    console.error(e);
  });

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  app.get('/status', (req, res) => {
    res.send('ok');
  });

  // app.get('/userinfo', (req, res) => {
  //   res.send([user.name, user.id, user.profilepic, user.rooms]);
  // });

  // app.get('/setroom', (req, res) => {
  //   var rm = req.query['room'];
  //   if (rm) {
  //     if (rm === 'main') rm = user.name;
  //     else rm = `chatrooms:${user.id}:${rm}`;
  //     if (changeRoom(rm)) console.log(`Changing rooms (to ${rm})`);
  //   }
  //   res.send('');
  // });

  app.get('/speak', (req, res) => {
    try {
      let message = decodeURI(req.query['message'].replace('%', ' percent'));
      client.say(room, message);
      res.send('');
    } catch (e) {
      console.error(e);
    }
  });

  // function changeRoom(newRoom) {
  //   if (newRoom === room) return false;
  //   client.part(room);
  //   console.log(`Parted room: ${room}`);
  //   room = newRoom;
  //   client.join(room).catch(err => {
  //     throw new Error(`Could not switch rooms. (To: ${newRoom}).\nError:${err}`);
  //   });
  //   console.log(`Joined room: ${room}`);
  // }

  // async function getUserData(username) {
  //   var req = await fetch(`https://api.twitch.tv/kraken/users?login=${username}`, {
  //     headers: {
  //       Accept: 'application/vnd.twitchtv.v5+json',
  //       'Client-ID': 'abe7gtyxbr7wfcdftwyi9i5kej3jnq',
  //       Authorization: `OAuth ${apikey}`,
  //     },
  //   });
  //   console.log(req);
  //   var res = await req.json();
  //   console.log(JSON.stringify(res));
  //   if (res['error'] || !res['users'].length) {
  //     console.log(JSON.stringify(res));
  //     throw new Error(`Could not fetch data.\n${res}`);
  //   }
  //   user.id = res['users'][0].id;
  //   user.profilepic = res['users'][0].profile_image_url;
  // }

  // async function getRooms(id) {
  //   try {
  //     var req = await fetch(`https://api.twitch.tv/helix/chat/${id}/rooms`, {
  //       headers: {
  //         Accept: 'application/vnd.twitchtv.v5+json',
  //         Authorization: `OAuth ${apikey}`,
  //       },
  //     });
  //     console.log(req);
  //     var res = await req.json();
  //     if (res['error']) throw new Error(`Could not fetch data.\n${res}`);
  //     user.rooms = res.rooms;
  //   } catch (e) {
  //     throw new Error(`Could not fetch data.\n${e}`);
  //   }
  // }

  app.listen(port, () => console.log(`Express server listening on port ${port}.`));
})();
