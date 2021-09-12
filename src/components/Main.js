import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './home/Home.js'
import NotFound from './NotFound.js'
const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='*' component={NotFound} />
        </Switch>
    </main>
);

export default Main;