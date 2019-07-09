import React from 'react';
import '../styles/Chess.css';

export default class ChessMenu extends React.Component {

    state = this._initialState();

    _initialState() {
        return {singlePlayer: false, localMatch: false, networkMatch: false,
            name1: '', name2: '', name1isWhite: true, aiDifficulty: 0, timeLimit: 0};
    }

    _renderBackButton() {
        return <div onClick={()=>this.setState(this._initialState())}>
                Back
            </div>
    }

    menu = [
        <div key='1' onClick={() => this.setState({singlePlayer: !this.state.singlePlayer})}>Single player</div>,
        <div key='2' onClick={() => this.setState({localMatch: !this.state.localMatch})}>Local match</div>,
        <div key='3' onClick={() => this.setState({networkMatch: !this.state.networkMatch})}>Network match</div>];

    render() {
        let children;
        if (this.state.singlePlayer) {
            children = this._renderSinglePlayerMenu();
        } else if (this.state.localMatch) {
            children = this._renderLocalMatchMenu();
        } else if (this.state.networkMatch) {
            children = this._renderNetworkMatchMenu();
        } else {
            children = this.menu;
        }
        return (
            <div className="Chess-menu">
                <div className='Chess-menu-content'>
                    {children}
                </div>
            </div>

        );
    }

    _renderSinglePlayerMenu() {
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                this.props.startMatch(this.state);
            }}>
                {this._renderBackButton()}
                <label>
                    Name:
                    <input type="text" name="name" value={this.state.name}
                           onChange={(event) => {this.setState({name1: event.target.value}); }} />
                </label>
                <div>AI type (option select)</div>
                <div>Select Colour</div>
                <div>Time Limit</div>
                <input type="submit" value="Start Match" />
            </form>
        );
    }

    _renderLocalMatchMenu() {
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                this.props.startMatch(this.state);
            }}>
                {this._renderBackButton()}
                <label>
                    Name 1:
                    <input type="text" name="name" value={this.state.name}
                           onChange={(event) => {this.setState({name1: event.target.value}); }} />
                </label>
                <label>
                    Name 2:
                    <input type="text" name="name" value={this.state.name}
                           onChange={(event) => {this.setState({name2: event.target.value}); }} />
                </label>
                <div>Select Colour</div>
                <div>Time Limit</div>
                <input type="submit" value="Start Match" />
            </form>
        );
    }

    _renderNetworkMatchMenu() {
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                this.props.startMatch(this.state);
            }}>
                {this._renderBackButton()}
                <label>
                    Name:
                    <input type="text" name="name" value={this.state.name}
                           onChange={(event) => {this.setState({name1: event.target.value}); }} />
                </label>
                <input type="submit" value="Find Match" />
            </form>
        );
    }
}