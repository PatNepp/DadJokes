import React, { Component } from 'react';
import './JokesList.css';
import Jokes from './Jokes';
import axios from 'axios';

class JokesList extends Component {
	static defaultProps = {
		numJokesToGet: 6
	};
	constructor(props) {
		super(props);
		this.state = {
			jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
			loading: false
		};
		this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
	}
	componentDidMount() {
		if (this.state.jokes.length === 0) this.getJokes();
	}
	async getJokes() {
		try {
			let jokes = [];
			while (jokes.length < this.props.numJokesToGet) {
				let result = await axios.get('https://icanhazdadjoke.com/', {
					headers: { Accept: 'application/json' }
				});
				let newJoke = result.data.joke;
				if (!this.seenJokes.has(newJoke)) {
					jokes.push({ text: result.data.joke, votes: 0, id: result.data.id });
				} else {
					console.log('FOUND A DUPLICATE');
				}
			}
			this.setState(
				(st) => ({
					loading: false,
					jokes: [ ...st.jokes, ...jokes ]
				}),
				() => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
			);
		} catch (e) {
			alert(e);
			this.setState({
				loading: false
			});
		}
	}
	handleVote(id, delta) {
		this.setState(
			(st) => ({
				jokes: st.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
			}),
			() => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
		);
	}
	handleClick = () => {
		this.setState({ loading: true }, this.getJokes);
	};
	render() {
		//THIS WILL SORT VOTES. CURRENTLY NOT ACTIVE
		// let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes)
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
		if (this.state.loading) {
			return (
				<div className="JokeList-spinner">
					<i className="far fa-8x fa-laugh fa-spin" />
					<h1 className="JokeList-title">Loading...</h1>
				</div>
			);
		}
		return (
			<div className="JokeList">
				<div className="JokeList-sidebar">
					<h1 className="JokeList-title">
						<span>Dad</span> Jokes
					</h1>
					<img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
					<button className="JokeList-newJokes" onClick={this.handleClick}>
						Add More Jokes
					</button>
				</div>
				<div className="JokeList-jokes">{joke}</div>
			</div>
		);
	}
}

export default JokesList;
