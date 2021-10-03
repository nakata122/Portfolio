import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './home/Home.js'
import Face from './face/Face.js'
import NotFound from './NotFound.js'
const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Face} />
            <Route exact path='/home' component={Home} />

        </Switch>
    </main>
);

export default Main;