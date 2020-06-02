import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Header from '../elements/Header/Header';
import Home from '../Home/Home';
import NotFound from '../elements/NotFound/NotFound';
import Movie from '../Movie/Movie';

const App = ()=>{
    return (
        <BrowserRouter basename="rmdb">
            <React.Fragment>
                <Header />
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/:movieId" component={Movie} exact />
                    <Route path="*" component={NotFound} />
                </Switch>
            </React.Fragment>
        </BrowserRouter>
    );
}

export default App;