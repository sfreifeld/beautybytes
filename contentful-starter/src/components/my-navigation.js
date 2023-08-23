import React from 'react'
import { Link } from 'gatsby'

import '../scss/index.scss';



const Navigation = () => (
<nav className="topnav navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
<div className="container">
	<Link className="navbar-brand" to="./index.html"><img src="assets/img/retro-logo-bg.png" width={120} alt='logo'/></Link>
	<button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
	<span className="navbar-toggler-icon"></span>
	</button>
	<div className="navbar-collapse collapse" id="navbarColor02">
		<ul className="navbar-nav mr-auto d-flex align-items-center">
			<li className="nav-item">
			<Link className="nav-link" to="./">About</Link>
			</li>
			<li className="nav-item">
			<Link className="nav-link" to="./">News</Link>
			</li>
			<li className="nav-item">
			<Link className="nav-link" to="./">Events</Link>
			</li>
			<li className="nav-item">
			<Link className="nav-link" to="./">Sustainability</Link>
			</li>
			<li className="nav-item">
			<Link className="nav-link" to="./">Spotlight</Link>
			</li>
			<li className="nav-item">
			<Link className="nav-link" to="./">Trending</Link>
			</li>            
			<li className="nav-item">
			<Link className="nav-link" to="./">Fact Or Fad</Link>
			</li>
			<li className="nav-item">
			<Link className="nav-link" to="./">Reviews</Link>
			</li>
		</ul>
		<ul className="navbar-nav ml-auto d-flex align-items-center">
			<li className="nav-item highlight">
			</li>
		</ul>
	</div>
</div>
</nav>

)

export default Navigation