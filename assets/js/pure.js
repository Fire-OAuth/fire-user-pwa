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

function getDomain(url) {
    let newUrl = new URL(url)
    return newUrl.hostname
}

function timeDifference(current, previous) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;

	var elapsed = current - previous;

	if (elapsed < msPerMinute) {
		if (elapsed / 1000 < 30) return "Just now";
		return Math.round(elapsed / 1000) + "s";
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + "m";
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + "h";
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) + "d";
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + "month";
	} else {
		return Math.round(elapsed / msPerYear) + "y";
	}
}

function showListOfTransactions (data) {
    let html
    data.forEach(element => {

        let domain = getDomain(element.url)
        let timeAgo = timeDifference(new Date.now(), new Date(element.time))

        html += `<div class="signup">
        <div class="signupHeader">
            <div class="signupDomain"> ${domain} </div>
            <div class="signupTime"> 1h </div>
        </div>
        <div class="signupInfo">
            <div class="signUpInfoContainer">
                <div class="fullSignupDomain">
                    ${element.url}
                </div>
                <div class="fullTimeContainer">
                    ${element.time}
                </div>
                <div class="signupMethod">
                    Method: ${element.method}
                </div>
            </div>
        </div>
    </div>`
    });
}