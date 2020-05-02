import Push from "push.js";

export const isNotificationEnabled = Push.Permission.has();

export const notify = () => {
	Push.create("Neuer Student!", {
		body: "Ein neuer Student hat sich eingeloogt",
		onClick: function () {
			window.focus();
		},
	});
};
