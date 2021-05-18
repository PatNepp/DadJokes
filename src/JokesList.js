import React, { Component } from 'react';
import './JokesList.css';
import Jokes from './Jokes';
import axios from 'axios';

class JokesList extends Component {
	static defaultProps = {
		numJokesToGet: 10
	};
	constructor(props) {
		super(props);
		this.state = { jokes: [] };
	}
	async componentDidMount() {
		let jokes = [];
		while (jokes.length < this.props.numJokesToGet) {
			let result = await axios.get('https://icanhazdadjoke.com/', {
				headers: { Accept: 'application/json' }
			});
			jokes.push({ text: result.data.joke, votes: 0, id: result.data.id });
			console.log(result);
		}
		this.setState({
			jokes: jokes
		});
	}
	handleVote(id, delta) {
		this.setState((st) => ({
			jokes: st.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
		}));
	}
	render() {
		const joke = this.state.jokes.map((joke) => (
			<Jokes
				key={joke.id}
				id={joke.id}
				votes={joke.votes}
				text={joke.text}
				upVote={() => this.handleVote(joke.id, 1)}
				downVote={() => this.handleVote(joke.id, -1)}
			/>
		));
		return (
			<div className="JokeList">
				<div className="JokeList-sidebar">
					<h1 className="JokeList-title">
						<span>Dad</span> Jokes
					</h1>
					<img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
					<button className="JokeList-newJokes">New Jokes</button>
				</div>
				<div className="JokeList-jokes">{joke}</div>
			</div>
		);
	}
}

export default JokesList;
