function returnUserCard(user) {
	return `<div class="userContainer">
                <div class="transparentCard">
                    <img src="${user.profilePic}" alt="Profile Pic">
                </div>
                <div class="userCard">
                    <div class="nameContainer">
                        <span class="firstName">${user.firstName}</span>
                        <span class="lastName">${user.lastName}</span>
                    </div>
                    <div class="email"><a href="mailto:${user.email}" aria-label="Email">${user.email}</a></div>
                </div>
            </div>`
}
