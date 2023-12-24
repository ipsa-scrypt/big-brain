import { useEffect } from 'react';

const createPDFLink = (pdf: Record<string, string>) => {
	const img = document.createElement('img');
	const div = document.createElement('div');
	const link = document.createElement('button');

	console.log('pdf', pdf.name);

	img.src = '././img/pdf-extension.png';
	img.alt = 'pdf-logo';
	img.className = 'pdf-icon-img';

	div.className = 'icon-link-content';

	link.className = 'dl-btn';
	link.textContent = pdf.name as string;
	link.onclick = () => {
		// Decode base64 data, create Uint8Array, and then create blob
		const binaryString = atob(pdf.data as string);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let ind = 0; ind < len; ind++) {
			bytes[ind] = binaryString.codePointAt(ind) as number;
		}

		const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = pdf.name as string;
		link.click();
	};

	div.appendChild(img);
	div.appendChild(link);
	return div;
};

const displayPDFs = (pdfData: Record<string, string>[]) => {
	console.log('displayPDFs', pdfData);
	const container = document.querySelector('.bb-sent-files-container');
	const loaderContainer = document.querySelector('.loader-container');
	const sendBtn = document.querySelector('.send-btn');
	if (container) {
		loaderContainer?.classList.remove('loader-container-appear');
		sendBtn?.classList.remove('send-btn-disappear');
		container.textContent = '';

		for (const pdf of pdfData) {
			if (!pdf.data) {
				continue;
			}

			const div = createPDFLink(pdf);
			container.appendChild(div);
		}
	}
};

export const Outputs = ({
	submittedRequest,
	pdfData,
}: {
	pdfData: Record<string, string>[];
	submittedRequest: string;
}) => {
	useEffect(() => {
		if (pdfData.length > 0) {
			displayPDFs(pdfData);
		}
	}, [pdfData]); // Dependency array includes pdfData so effect runs whenever pdfData changes

	// render
	return (
		<div className="output">
			<div className="student-request-container">
				<img src={'././img/user.png'} alt="student-logo" className="student-logo"></img>
				<p className="student-question">{submittedRequest}</p>
			</div>
			{pdfData.length > 0 && (
				<>
					<div className="bb-answer-container">
						<img src={'././img/brain.png'} alt="brain-logo" className="ai-logo"></img>
						<p className="bb-answer">
							Voici ce que j'ai trouvé en lien avec ce que tu as demandé :
						</p>
					</div>
					<div className="bb-sent-files-container"></div>
				</>
			)}
		</div>
	);
};
