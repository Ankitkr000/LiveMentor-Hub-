const userModel = require("../Models/userSchema");
const doubtModel=require("../Models/doubtSchema")
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("register_socket", async ({ userId }) => {
      await userModel.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
      });
    });

socket.on("join_room", ({ roomId }) => {
  try {
 
    socket.rooms.forEach(room => {  // leave previous room
      if (room !== socket.id) {
        socket.leave(room);
      }
    });



    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);
    


    // Send join acknowledgment
    socket.emit("joined_room_ack", { roomId });
    
  } catch (error) {
    console.error("Error joining room:", error);
    socket.emit("error", { message: "Failed to join room" });
  }
});









    socket.on("accept_doubt", async ({ doubtId, studentSocketId }) => {
      try {
        const doubt = await doubtModel.findById(doubtId);
        
        
        if (!doubt) {                                             // checking if doubt exist AND is not already assigned
          socket.emit("error", { message: "Doubt not found" }); 
          return;
        }

        if (doubt.isAssigned) {
          console.log(`Doubt ${doubtId} already taken`);
          socket.emit("doubt_already_taken", { doubtId });
          return;
        }

        console.log(`Teacher ${socket.id} accepting doubt ${doubtId}`);

        // Mark doubt as assigned immediately
        doubt.isAssigned = true;                               
        doubt.assignedTeacherId = socket.id;
        await doubt.save();

        
        io.to(studentSocketId).emit("doubt_accepted", {   //notifying student first 
          doubtId,
          teacherSocketId: socket.id 
        });

        
        socket.broadcast.emit("doubt_taken", { doubtId });   // then notifying other teachers

      } catch (error) {
        console.error("Error in accept_doubt:", error);
        socket.emit("error", { message: "Failed to accept doubt" });
      }
    });







    socket.on("send_message", ({ roomId, sender, message, fileData }) => {
      io.to(roomId).emit("receive_message", { sender, message, fileData });
    });

  
    socket.on("offer", ({ offer, roomId }) => {              //WebRTC Signaling
      console.log(" Forwarding offer to room:", roomId);
      socket.to(roomId).emit("offer", { offer, roomId });
    });

    socket.on("answer", ({ answer, roomId }) => {
      console.log(" Forwarding answer to room:", roomId);
      socket.to(roomId).emit("answer", { answer, roomId });
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
      console.log(" Forwarding ICE candidate to room:", roomId);
      socket.to(roomId).emit("ice-candidate", { candidate, roomId });
    });




socket.on("leave_room", ({ roomId }) => {
  socket.leave(roomId);
  socket.to(roomId).emit("user_left", { socketId: socket.id });  // Inform others with socket ID

  console.log(` ${socket.id} left room: ${roomId}`);

});


// Group meeting handlers
socket.on("join_group_meeting", ({ meetingLink, userName, userId }) => {
  try {
    socket.join(meetingLink);
    
    // Get all other participants in the room
    const room = io.sockets.adapter.rooms.get(meetingLink);
    const participants = room ? Array.from(room).filter(id => id !== socket.id) : [];
    
    console.log(`${userName} (${socket.id}) joined group meeting: ${meetingLink}`);
    console.log(`Current participants: ${participants.length + 1}`);
    
    // Notify existing participants about new user
    socket.to(meetingLink).emit("new_participant_joined", {
      socketId: socket.id,
      userName,
      userId
    });
    
    // Send existing participants list to new user
    socket.emit("existing_participants", { participants });
    
  } catch (error) {
    console.error("Error joining group meeting:", error);
    socket.emit("error", { message: "Failed to join meeting" });
  }
});

socket.on("leave_group_meeting", ({ meetingLink }) => {
  socket.leave(meetingLink);
  socket.to(meetingLink).emit("participant_left", { socketId: socket.id });
  console.log(`${socket.id} left group meeting: ${meetingLink}`);
});

// WebRTC signaling for group calls
socket.on("group_offer", ({ offer, targetSocketId, meetingLink }) => {
  console.log(`Forwarding offer from ${socket.id} to ${targetSocketId}`);
  io.to(targetSocketId).emit("group_offer", {
    offer,
    fromSocketId: socket.id,
    meetingLink
  });
});

socket.on("group_answer", ({ answer, targetSocketId, meetingLink }) => {
  console.log(`Forwarding answer from ${socket.id} to ${targetSocketId}`);
  io.to(targetSocketId).emit("group_answer", {
    answer,
    fromSocketId: socket.id,
    meetingLink
  });
});

socket.on("group_ice_candidate", ({ candidate, targetSocketId, meetingLink }) => {
  io.to(targetSocketId).emit("group_ice_candidate", {
    candidate,
    fromSocketId: socket.id,
    meetingLink
  });
});






    socket.on("disconnect", async () => {
      console.log(" Disconnected:", socket.id);
      await userModel.findOneAndUpdate(
        { socketId: socket.id },
        {
          isOnline: false,
          isAvailable: false,
          $unset: { socketId: "" },
        }
      );
    });
  });
};

module.exports = socketHandler;
