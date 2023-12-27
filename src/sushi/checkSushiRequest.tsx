export const checkRequest = async (request: string) => {
	console.log('checkRequest', request);
	try {
		const response = await fetch(
			`http://${import.meta.env.VITE_APP_PROD_SERVER_IP}:${
				import.meta.env.VITE_APP_API_PORT
			}/checkRequest`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ data: { request } }),
			},
		);

		if (!response.ok) {
			console.error('Server responded with non-2xx status:', response.status);
			return { success: false, message: 'Server error occurred. Please try again.' };
		}

		const data = await response.json();
		console.log('checkRequest data', data);
		return { success: true, data };
	} catch (error) {
		console.error('Network error:', error);
		return { success: false, message: 'Network error occurred. Please try again later.' };
	}
};
