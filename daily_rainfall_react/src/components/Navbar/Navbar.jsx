import React, { useContext } from "react"
import { UserContext } from "../../App"
import { Button, Menu, MenuItem, ButtonGroup } from "@mui/material"
import "./navbar.css"

/*
    Props:
		login
        logout
        uploadData
*/

const Navbar = (props) => {
	// Get the user context
	const user = useContext(UserContext)

	/*
		Operations needed for the menu item from MUI
	*/
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	/* eslint-disable react/prop-types */
	const handleCloseLogout = () => {
		setAnchorEl(null)
		props.logout()
	}

	const handleCloseLogin = () => {
		setAnchorEl(null)
		props.login()
	}

	const handleCloseUploadData = () => {
		setAnchorEl(null)
		props.uploadData()
	}

	return (
		<div id="navbar-container">
			<h1 id="main-heading">UP Daily Rainfall</h1>
			{/* Heading for a smaller screen  */}
			<h3 id="responsive-heading">UP Daily Rainfall</h3>
			{
				// If user signed in change Welcome to show username
				<h2>{user.username ? user.username : "Welcome"}</h2>
			}
			<div id="navbar-btn-container">
				<ButtonGroup
					id="button-menu"
					variant="contained"
					size="small"
					aria-label="outlined primary button group"
				>
					<Button>About Project</Button>
					{
						// If user signed in show logout button else show login button
						user.username ? (
							/* eslint-disable react/prop-types */
							<Button onClick={props.logout}>Logout</Button>
						) : (
							<Button onClick={props.login}>Login</Button>
						)
					}
					{
						// If user signed in enable button
						<Button disabled={!user.username} onClick={props.uploadData}>
							Upload Data
						</Button>
					}
				</ButtonGroup>
				{/* Menu for smaller screens */}
				<div id="drop-menu">
					<Button
						id="basic-button"
						variant="contained"
						size="medium"
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
					>
						Menu
					</Button>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button"
						}}
					>
						<MenuItem onClick={handleClose}>About Project</MenuItem>
						{
							// If user signed in show logout button else show login button
							user.username ? (
								/* eslint-disable react/prop-types */
								<MenuItem onClick={handleCloseLogout}>Logout</MenuItem>
							) : (
								<MenuItem onClick={handleCloseLogin}>Login</MenuItem>
							)
						}
						{
							// If user signed in enable button
							<MenuItem
								disabled={!user.username}
								onClick={handleCloseUploadData}
							>
								Upload Data
							</MenuItem>
						}
					</Menu>
				</div>
			</div>
		</div>
	)
}

export default Navbar
