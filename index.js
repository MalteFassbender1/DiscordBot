const Discord = require("discord.js");
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const token = "NzU4NjEzMDMwOTg3NjI4NjA1.X2xfcA.XdnPNKdJO04tObqIvQuibhF4prE";
const prefix = "!";

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

const logChannelID = "758612460021481503"
const adminRoleID = "758610699366301716";
const welcomeChannelID = "758610728625504276";

const verifiedId = "758610803770523668";
const unverifiedId = "758610728625504276"
const ReactionMsgID = "758787654548193280";

var displayGame = "countless";
var logChannel = null;
var welcomeChannel = null;


bot.login(token);
bot.on("ready", () =>{
    console.log("Bot online as "+ bot.user.tag);
    bot.user.setPresence({ status: 'online', game: { name: displayGame } });

    logChannel = bot.channels.cache.get(logChannelID);
    welcomeChannel = bot.channels.cache.get(welcomeChannelID);
})

bot.on('guildMemberAdd', (guildMember) => {
    guildMember.roles.add(unverifiedID);
    JoinEmbed(guildMember);
});

bot.on("message", msg=>                                             
{
    let args = msg.content.substring(prefix.length).split(" ");
    var hasAdminRights = msg.member.roles.cache.has(adminRoleID);

    if(hasAdminRights)
    {
      switch(args[0])
      {
        case "clear" :
          clearChat(args[1] , msg);
          break;
        
        case "kick" :
          kickMember(msg.mentions.users.first(), msg);
          break;

        case "ban" :
          banMember(msg.mentions.users.first(), msg);
          break;

        case "addreact" :
          addReactionMessage(msg, args[1]);
          break;

        case "removereact" :
          deleteReactionMessage(msg, args[1]);
          break;


      }  
    }

    switch(args[0])
    {
      case "ping" :
        BotPing(msg)
        break;

      case "userinfo" :
        GetUserInfo(msg.mentions.users.first(), msg);
        break;

      case "help" :
        HelpEmbed(msg);
        break;
    }
})


bot.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
  }
  if(reaction.message.id == ReactionMsgID)
  {
    if(reaction.message.member.roles.cache.some((role) => role.name === 'unverified') && !message.member.roles.cache.some((role) => role.name === 'verified'))
    {
      reaction.user.roles.add(verifiedId);
      reaction.user.roles.remove(unverifiedId);
    }
  }
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

//    messages.fetch(event.d.message_id).then(msg=> {})

//global functions

function logEmbed(txt)
{
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#674FA6')
  .setTitle('logs')
  
	.setDescription(txt)
	.setTimestamp()
	.setFooter('made by roza#6785', 'https://i.imgur.com/hnEtqIb.png');

  logChannel.send(exampleEmbed);
}

function JoinEmbed(guildmember)
{
  const user = guildmember.user;
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#16B824')
  .setTitle('joined')
  .setThumbnail(user.avatarURL())
  .setDescription(`User ${user.tag} has joined the server`)

	.addField(`Discord created `, `${user.createdAt.getFullYear()}.${user.createdAt.getMonth()}.${user.createdAt.getDate()}`, true)
  .addField(`Discord created `, `${user.createdAt.getFullYear()}.${user.createdAt.getMonth()}.${user.createdAt.getDate()}`, true)
  
	.setTimestamp()
	.setFooter('made by roza#6785', 'https://i.imgur.com/hnEtqIb.png');

  logChannel.send(exampleEmbed);
}

//need admin rights

function clearChat(args1, msg)
{
  if(!args1) 
    return msg.reply("pls define number of messages to be deleted.")
  else
  {
    msg.channel.bulkDelete(args1);
    return logEmbed(`User ${msg.author.tag} used the clear command for ${args1} messages in ${msg.channel}`)
  }
}

function kickMember(member, msg )
{
  if(member)
  {
    msg.guild.member(member).kick('They were bad!').then(() => 
    {
      logEmbed(`User ${msg.author.tag} kicked ${member.tag} in ${msg.channel}`)
      return msg.reply(`Successfully kicked ${member.tag}.`);
      }).catch(err => 
      {
      console.error(err);
      return msg.reply('I was unable to kick the member');
    });
  }
  else
  {
    return msg.reply('TYou didn\'t mention the user to kick!');
  }
}

function banMember(member, msg)
{
    if(member)
    {
      msg.guild.member(member).ban('They were bad!').then(() => 
      {
        logEmbed(`User ${msg.author.tag} banned ${member.tag} in ${msg.channel}`)
        return msg.reply(`Successfully banned ${member.tag}.`);
        }).catch(err => 
        {
        console.error(err);
        return msg.reply('I was unable to ban the member');
      });

    }
    else
    {
      return msg.reply("You didn\'t mention the user to ban!");
    }

}

function addReactionMessage(msg, arg1)
{
  if(arg1)
  {
    reactionIDs.push(arg1);

    const channelName = msg.channel.messages.fetch(arg1).author; //.channel
    logEmbed(`User ${msg.author.tag} made a reaction message with the id ${arg1} in the channel ${channelName}`);
    return msg.reply("succesfully added it to watchlist");
  }
  else
  return msg.reply("please specify a message id to make a reaction message");
}

function deleteReactionMessage(msg, arg1)
{
  if(arg1)
  {
    const index = reactionIDs.indexOf(arg1);
    if (index > -1) 
    {
      reactionIDs.splice(index, 1);
      const channelName = msg.channel.messages.fetch(arg1);
      logEmbed(`User ${msg.author.tag} removed a reaction message with the id ${arg1} in the channel ${channelName}`);
      return msg.reply("succesfully removed id");
    }
    else
    {
      return msg.reply("shit bruv that id is not in the list");
    }
  }
  else
  return msg.reply("please specify a message id to remove");
}

//don't need admin rights

function BotPing(msg)
{
  return msg.channel.send(`Fetching!`).then(m => 
  {
    m.edit(`**Bot** - ` + (m.createdTimestamp - msg.createdTimestamp) + `ms.` + ` \n**Discord API** - ` + Math.round(bot.ping) + `ms.`);
  });
}

function GetUserInfo(user, msg)
{
  if(user)
  {
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#16B824')
      .setTitle('user info')
      .setThumbnail(user.avatarURL())
      
      .addField(`Discord created `, `${user.createdAt.getFullYear()}.${user.createdAt.getMonth()}.${user.createdAt.getDate()}`, true)
      
      .setTimestamp()
      .setFooter('made by roza#6785', 'https://i.imgur.com/hnEtqIb.png');
    
      return msg.reply(exampleEmbed);
  }
  else
  {
    return msg.reply("please tag a user");
  }

}

function HelpEmbed(msg)
{
  const exampleEmbed = new Discord.MessageEmbed()
  .setColor('#16B824')
  .setTitle('Help')
  
  .addField(`*Admin commands:* `, `***clear x*** | removes x messages from the current chat.\n***kick member*** | kickes the mentioned member\n***ban member*** | bans the mentioned member\n `, true)
  .addField(`*User commands:*`, `***ping*** | displays the discord api ping and bot ping\n***userinfo member*** | displays usefull information about a member\n***help*** | shows usable commands\n `)
  
  .setTimestamp()
  .setFooter('made by roza#6785', 'https://i.imgur.com/hnEtqIb.png');

  return msg.reply(exampleEmbed);
}









      // case "close" :
        
      //     if (!msg.channel.name.startsWith(`ticket-`)) return msg.channel.send(`You can't use the close command outside of a ticket channel.`);
      //     // Confirm delete - with timeout (Not command)
      //     msg.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`!c\`. This will time out in 10 seconds and be cancelled.`)
      //         .then((m) => {
      //             msg.channel.awaitMessages(response => response.content === '!c', {
      //                     max: 1,
      //                     time: 10000,
      //                     errors: ['time'],
      //                 })
      //                 .then((collected) => {
      //                     msg.channel.delete();
      //                 })
      //                 .catch(() => {
      //                     m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
      //                         m2.delete();
      //                     }, 3000);
      //                 });
      //         });
      //         break;