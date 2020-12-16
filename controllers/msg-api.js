//const yup = require('yup');
//const mongoose = require('mongoose');
const mongoose = require('mongoose');
const messageModel = mongoose.model('message');

// let messages = [  { name: "Bill", msg: "Hi All!"},
//                 {  name:"Ann", msg: "ICS 221 is fun!"},
//                 {  name:"Johnny", msg: "I'm stranded!"},
//                 {  name:"Barb", msg: "Hi"},
//                 {  name:"Frank", msg: "Who's tired?"},
//                 {  name:"Sarah", msg: "I heart React"}
//             ]; 

//schema is reference to the yup.object
//declaring 2 properties in this object: name and msg
// const schema = yup.object({
//   //trim whitespace
//   //set min length to 2
//   //max length to 10
//   //added regex to name to ensure user enters only Upper and Lowercase letters
//   //want a good error messag here to make it clear to users what they shuld be entering
//   name: yup
//     .string()
//     .trim()
//     .min(2, 'Your name must be at least 2 characters!')
//     .max(10, 'Your name cannot be more than 10 characters.')
//     .matches(/[A-za-z]{2,}/, 'Invalid name. Use Upper or Lowercase letters only.')
//     .required('Your name is required.'),
//     //same as above, but expect a minimum of 3 characters and a max of twenty
//     //no regex bc we want freedom
//   msg: yup
//     .string()
//     .trim()
//     .min(3, 'Your message must be at least 3 characters!')
//     .max(20, 'Your message must be no more than 20 characters.')
//     .required('A message is required.')
// });

// const messageSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     match: /[A-Za-z]{2,}/,
//     minlength: 2,
//     maxlength: 30
//   },
//   msg: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 20
//   }
// });


// GET Request Handler
const getAllMessages = (req, res) => {
  //creates a json object with a messages propery whose value is the message
  //res.status(200).json({ 'messages': messages });
  //ensures that messages is defined
  //type of cant specifically determine whether it is an array or not so thats where Array.isArray()
  // if (typeof messages === 'object' && Array.isArray(messages)) {
  //   res.status(200).json({ 'messages': messages });
  // } else {
  //   res.status(400).send('Bad Request');
  // }

messageModel
  .find()
  .sort( {'_id': -1} )
  .exec( (error, messages) => {
  if (error) {
    res.status(400).send('Bad Request');
  } else {
    res.status(200).json(messages);
  }
});

};
 
// POST Request Handler
// const addNewMessage = (req, res) => {
//   res.status(200).send('Successful API POST Request');
// };

const addNewMessage = async (req, res) => {
  // try {
  //   let message = await schema.validate(req.body);
  //   // TODO: add message as first element of array and
  //   // respond with 201 Created and the message in the body
  //   // of the response.
  //   messages.unshift(message);
  //   res.status(201).json(message);
  //   console.log(messages)

  // } catch(error) {
  //     res
  //       .status(400)
  //       .send('Bad Request. The message in the body of the \
  //       Request is either missing or malformed.');
  // }

  messageModel
  .create( req.body, (error, message) => {
    if (error) {
      res
      .status(400)
      .send('Bad Request. The message in the body of the \
        Request is either missing or malformed.');
    } else {
      res.status(201).json(message);
    }
  });
};

module.exports = {
    getAllMessages,
    addNewMessage
}