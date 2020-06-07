import React from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import './App.css';

class App extends React.Component {
  state = {
    servers: 0,
    tasks: [],
    taskNumber: 0,
    finishedTasks: [],
    inProgressTasks: [],
    pendingTasks: [],
  }
  removeServer = () => {
    this.setState({
      servers: this.state.servers - 1,
    });
  }
  addServer = () => {
    this.setState({
      servers: this.state.servers + 1,
    });
  }
  renderServers = () => {
    let columns = [];
    for (let index = 0; index < this.state.servers; index++) {
      columns.push(
        <Grid item xs={12} sm={6} key={`Server-${index + 1}`}>
          <Paper className="server-style">
            <h3>{`Server - ${index + 1}`}</h3>
            {this.state.inProgressTasks[index] !== undefined && <div>
              {`Running Task - ${this.state.inProgressTasks[index] + 1}`}
              <div className="bar">
                <div className="in"></div>
              </div>
            </div>}
          </Paper>
        </Grid>
      )
    }
    return columns;
  }
  addTasks = (event) => {
    let tasks = Array.from(Array(parseInt(event.target.value, 10)).keys());
    this.setState({
      tasks: tasks,
      pendingTasks: tasks,
      taskNumber: event.target.value,
    })
  }
  removeTask = (index) => {
    this.state.pendingTasks.splice(index, 1);
    this.setState({
      taskNumber: parseInt(this.state.taskNumber, 10) - 1,
    })
  }
  executeTasks = () => {
    let inProgressTasks = [];
    if (this.state.pendingTasks.length === 0) {
      /**
       * When all taks finished delete all servers
       */
      clearInterval(this.interval);
      this.setState({
        servers: 0,
        taskNumber: 0,
      });
    }
    let finishedTasks = [];
    finishedTasks = this.state.finishedTasks.concat(this.state.inProgressTasks);
    this.state.pendingTasks.slice(0, this.state.servers).forEach(eachTask => {
      inProgressTasks.push(eachTask);
      this.state.pendingTasks.shift();
    })
    if (inProgressTasks.length !== this.state.servers) {
      this.setState({
        servers: inProgressTasks.length
      })
    }
    this.setState({
      inProgressTasks,
      finishedTasks
    });
  }

  startExecution = () => {
    /**
     * Start The Execution of Task Manager Assign First N task to N servers 
     */
    let inProgressTasks = [];
    this.state.pendingTasks.slice(0, this.state.servers).forEach(eachTask => {
      inProgressTasks.push(eachTask);
      this.state.pendingTasks.shift();
    })
    if (inProgressTasks.length !== this.state.servers) {
      /**
       * Delete Empty Server as In Progress tasks are less than the number of servers are available
       */
      this.setState({
        servers: inProgressTasks.length
      })
    }
    this.setState({
      inProgressTasks
    });
    this.interval = setInterval(() => this.executeTasks(), 20000);

  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <Container>
        <h2 className="App">Task Manager</h2>
        <Button variant="contained" color="primary" style={{ marginRight: '20px' }} onClick={this.addServer}>Add Server</Button>
        <Button variant="outlined" color="primary" onClick={this.removeServer} style={{ marginRight: '20px' }} >Remove Server</Button>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
          <TextField
            type="number"
            style={{ marginRight: '20px' }}
            onChange={this.addTasks}
            value={this.state.taskNumber}
            InputProps={{
              inputProps: {
                min: 0
              }
            }}
            label="Add Tasks">
          </TextField>
          <Button variant="contained" color="primary" disabled={this.state.servers <= 0} onClick={this.startExecution}>Start Execution</Button>
        </div>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={6}>
          <h4 className="App">Pending Task</h4>
            <List>
              {this.state.pendingTasks.map((value, index) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem dense button key={`task-${index}`}>
                    <ListItemText id={labelId} primary={`Task - ${value + 1}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments" onClick={() => this.removeTask(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h4 className="App">Completed Task</h4>
            <List>
              {this.state.finishedTasks.map((value, index) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem dense button key={`task-${index}`}>
                    <ListItemText id={labelId} primary={`Task - ${value + 1}`} />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
        {this.state.servers > 0 &&
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            {this.renderServers()}
          </Grid>
        }
      </Container>
    );
  }
}

export default App;
