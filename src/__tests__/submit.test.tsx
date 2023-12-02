import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { Submit } from '../components/submit.tsx';
import { sendToSushiAPI } from '../sushi/sushi.tsx';

jest.mock('../sushi/sushi.tsx', () => ({
	sendToSushiAPI: jest.fn(),
}));
describe('Submit component', () => {
	const setInputValue = jest.fn();
	const setShowOutputs = jest.fn();
	const setSubmittedRequest = jest.fn();

	beforeEach(() => {
		(sendToSushiAPI as jest.Mock).mockClear();
	});

	it('should display placeholder text when input is empty', () => {
		const { getByPlaceholderText } = render(
			<Submit
				inputValue=""
				setInputValue={setInputValue}
				setShowOutputs={setShowOutputs}
				setSubmittedRequest={setSubmittedRequest}
			/>,
		);
		const input = getByPlaceholderText('Pose moi ta question...');
		expect(input).toBeInTheDocument();
	});

	it('should update input value when typing', async () => {
		// Define a wrapper component that holds the state for inputValue
		const Wrapper = () => {
			const [inputValue, setInputValue] = useState('');
			return (
				<Submit
					inputValue={inputValue}
					setInputValue={setInputValue}
					setShowOutputs={setShowOutputs}
					setSubmittedRequest={setSubmittedRequest}
				/>
			);
		};

		const { getByPlaceholderText } = render(<Wrapper />);
		const input = getByPlaceholderText('Pose moi ta question...') as HTMLInputElement;
		await act(async () => {
			fireEvent.change(input, { target: { value: 'test' } });
		});
		expect(input.value).toBe('test');
	});

	it('should clear input value when submit button is clicked', async () => {
		(sendToSushiAPI as jest.Mock).mockResolvedValueOnce('clear input');
		const Wrapper = () => {
			const [inputValue, setInputValue] = useState('test');
			return (
				<Submit
					inputValue={inputValue}
					setInputValue={setInputValue}
					setShowOutputs={setShowOutputs}
					setSubmittedRequest={setSubmittedRequest}
				/>
			);
		};

		const { getByRole, getByPlaceholderText } = render(<Wrapper />);

		const input = getByPlaceholderText('Pose moi ta question...') as HTMLInputElement;
		const button = getByRole('button');
		fireEvent.click(button);
		await waitFor(() => {
			expect(sendToSushiAPI).toHaveBeenCalledTimes(1);
			expect(input.value).toBe('');
		});
	});

	it('should not submit when input is empty', () => {
		const { getByPlaceholderText, getByRole } = render(
			<Submit
				inputValue=""
				setInputValue={setInputValue}
				setShowOutputs={setShowOutputs}
				setSubmittedRequest={setSubmittedRequest}
			/>,
		);
		const input = getByPlaceholderText('Pose moi ta question...') as HTMLInputElement;
		const button = getByRole('button');
		fireEvent.click(button);
		expect(input.value).toBe('');
	});
});