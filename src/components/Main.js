
require('styles/App.scss');

import React from 'react';


let imagesList = require('../data/imageDatas.json');
// alert(imagesList)


class AppComponent extends React.Component {
  render() {
    return (
		<div className="stage">
			<section className="img-list"></section>
			<nav className="nav-list"></nav>
		</div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
