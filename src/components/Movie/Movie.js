import React, { Component } from 'react';
import {API_URL, API_KEY} from '../../config'

import './Movie.css'
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Spinner from '../elements/Spinner/Spinner';
import Actor from '../elements/Actor/Actor';

class Movie extends Component {
    state = {
        movie: null, 
        actors: null, 
        directors: [],
        loading: false,
    }

    componentDidMount(){
        if(localStorage.getItem(`${this.props.match.params.movieId}`)){
            const state = JSON.parse(localStorage.getItem(`${this.props.match.params.movieId}`));
            this.setState({...state});
        }else{
            this.setState({
                loading: true
            })
            const endPoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
            this.fetchItems(endPoint);
        }
    }

    fetchItems = (endPoint)=>{
        fetch(endPoint)
            .then(res=>res.json())
            .then(data=>{
                if(data.status_code){
                    this.setState({loading: false});
                }else{
                    this.setState({movie:data},()=>{
                        const endPoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;
                        fetch(endPoint)
                            .then(res=>res.json())
                            .then(data=>{
                                const directors = data.crew.filter((member)=>member.job === 'Director');
                                this.setState({
                                    actors: data.cast,
                                    directors,
                                    loading: false
                                },()=>{
                                    localStorage.setItem(`${this.props.match.params.movieId}`, JSON.stringify(this.state))
                                })
                            })

                    })
                }
            }).catch(err=>console.error('Error', err))
    }

    render() {
        return (
            <div className="rmdb-movie">
                {this.state.movie ?
                    <div>
                        <Navigation movie={this.props.location.movieName}/>
                        <MovieInfo movie={this.state.movie} directors={this.state.directors} />
                        <MovieInfoBar time={this.state.movie.runtime} budget={this.state.movie.budget} revenue={this.state.movie.revenue}  />
                    </div>
                    : null
                }
                {this.state.actors ?
                    <div className="rmdb-movie-grid">
                        <FourColGrid 
                            header={'Actors'}
                        >
                            {this.state.actors.map((element, i)=>{
                                return <Actor key={i} actor={element} />
                            })}
                        </FourColGrid>
                    </div>
                    : null
                }
                {!this.state.actors && !this.state.loading ? <h1>No Movie Found!</h1> : null }
                {this.state.loading ? <Spinner /> : null}
            </div>
        );
    }
}

export default Movie;