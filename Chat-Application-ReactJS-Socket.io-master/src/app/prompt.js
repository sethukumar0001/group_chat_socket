import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

class Prompt extends Component {
  constructor() {
    super();
    this.state = {
      openDialog: true,
      openSnack: false,
      snackMsg: "",
    };
  }

  okBox = () => {
    let name = document.getElementById("nimi").value;
    switch(name){
      case "":
      this.setState({
        snackMsg: "No name given!",
        openSnack: true
      });
      break;

      default:
      this.setState({
        openDialog: false,
      });
      this.props.sendNimi(name);
    }
  }

  cancelBox = () => {
    this.setState({
      openDialog: false,
    });
    let name = "Guest";
    this.props.sendNimi(name);
  }


  render () {
    const actions = [
      <FlatButton
        label="Continue as Guest"
        primary={true}
        onTouchTap={this.cancelBox}
        keyboardFocused={true}
      />,
      <FlatButton
        label="Set Name"
        primary={true}
        onTouchTap={this.okBox}
      />,
    ];
    return (
      <div>
        <Dialog
          title="Choose user name"
          actions={actions}
          modal={false}
          open={this.state.openDialog}
          onRequestClose={this.handleClose}
        >
          <TextField
            id="nimi"
            hintText="Type Name"
            fullWidth={true}
          />
        </Dialog>
        <Snackbar
         open={this.state.openSnack}
         message={this.state.snackMsg}
         autoHideDuration={3000}
       />
      </div>
    );
  }
}

export default Prompt;
