import React, { Component } from 'react';
import io from 'socket.io-client';
import isEmpty from 'lodash/isEmpty';
import '../assets/css/app.scss';
import 'bootstrap/dist/css/bootstrap.css';
import Prompt from './prompt.js';
//const socket = io('http://localhost:3000');
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { orange500 } from 'material-ui/styles/colors';
//import Avatar from 'material-ui/Avatar';
//import Chip from 'material-ui/Chip';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Snackbar from 'material-ui/Snackbar';
import { Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


const styles = {
  underLine: {
    borderColor: orange500,
  },
  chip: {
    margin: 4,
    textAlign: 'left',
  },
  chatMessage: {
    lineHeight: '6px',
    float: 'left',
    clear: 'both',
    marginBottom: '15px'
  },
  ownMessage: {
    lineHeight: '6px',
    float: 'right',
    clear: 'both',
    marginBottom: '15px'
  },
  ownName: {
    lineHeight: '6px',
    textAlign: 'right',
    paddingRight: '15px'
  },
  otherName: {
    lineHeight: '6px',
    textAlign: 'left'
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket : io(),
      messages: [],
      name:"",
      uniqueId:"",
      listOnline: [],
      openSnack: false,
      snackMsg: "",
    };
  }

  componentDidMount = () => {
    this.state.socket.on("assigning-userid-and-history", (details) => {
      this.setState({
        uniqueId: details.userId,
        messages: details.history,
        listOnline: details.onlineUsers
      });
    });
    this.state.socket.on("receive-message", (msg) => {
      let messages = this.state.messages;
      messages.push(msg);
      this.setState({
        messages: messages
      });
    });
    this.state.socket.on("list-online", (onlineUsers) => {
      this.setState({
        listOnline: onlineUsers
      });
    });
    this.state.socket.on("user-joined", (user) => {
      this.setState({
        snackMsg: `${user} Joined!`,
        openSnack: true,
      });
    });
    this.state.socket.on("user-left", (user) => {
      this.setState({
        snackMsg: `${user} left!`,
        openSnack: true,
      });
    });
    //console.log(this.state.messages);
  }

  sendMessage = (event) => {
    //console.log(event.key);
    if(event.key === 'Enter'){
      let userMsg = {
        uniqueId: this.state.uniqueId,
        userName: this.state.name,
        message: document.getElementById("message").value
      };
      this.state.socket.emit("new-message", userMsg);
      document.getElementById("message").value="";
      //console.log(this.state.messages);
    }
  }

  setName = (value) => {
    this.setState({
      name: value,
    });
    this.state.socket.emit("new-user", value);
  }

  closeSnack = () => {
    this.setState({
      openSnack: false,
    });
  }

  render () {
    let selectUserName = <h2>Select username</h2>;
    let beginChat = <h3 className="begin">Begin Chat</h3>;
    let messages = this.state.messages;
    /*let history = isEmpty(messages)?beginChat:messages.map((item, i) => {
      return <div key={i} style={item.uniqueId===this.state.uniqueId && item.userName===this.state.name?styles.ownMessage:styles.chatMessage}><Subheader style={item.uniqueId===this.state.uniqueId && item.userName===this.state.name?styles.ownName:styles.otherName}>{item.userName}</Subheader>
             <Chip style={styles.chip} >
              <Avatar src="https://cdn.pixabay.com/photo/2015/09/06/20/31/frog-927765_960_720.jpg" />
              {item.message}
             </Chip></div>;
    });*/

    let history = isEmpty(messages)?beginChat:messages.map((item, i) => {
      return  <div key={i} style={item.uniqueId===this.state.uniqueId && item.userName===this.state.name?styles.ownMessage:styles.chatMessage}>
                <Subheader style={item.uniqueId===this.state.uniqueId && item.userName===this.state.name?styles.ownName:styles.otherName}> {item.userName} </Subheader>
                <Label as='div' style={styles.chip} image>
                <img src="https://cdn.pixabay.com/photo/2015/09/06/20/31/frog-927765_960_720.jpg" align="right"/>
                {item.message}
                </Label>
              </div>;
    });

    let listOnline = this.state.listOnline;
    let onlineUsers = listOnline.map((item, i) => {
      return <ListItem key={i} primaryText={item} leftIcon={<ActionGrade />} />;
    });

    return(
      <MuiThemeProvider>
      <div className="container-fluid">
        <div className="col-md-8">
        <Paper className="paper_class">
        <Prompt sendNimi={(value) => {this.setName(value);}}/>
        <h1>Lets Chat</h1>
          <div>
            {this.state.name!==""?history:selectUserName}
          </div>
        <TextField
          id="message"
          hintText="Type Message"
          fullWidth={true}
          onKeyPress={(e) => {this.sendMessage(e);}}
          underlineStyle = {styles.underLine}
        />
        </Paper>
        <Snackbar
         open={this.state.openSnack}
         message={this.state.snackMsg}
         autoHideDuration={3000}
         onRequestClose={this.closeSnack}
       />
        </div>
        <div className="col-md-4">
        <Paper className="paper_class">
          <h2>Online</h2>
          <List>
          {onlineUsers}
          </List>
        </Paper>
        </div>
      </div>
      </MuiThemeProvider>
    );

  }

}

export default App;
