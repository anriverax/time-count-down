// @flow
import React, { useEffect, useState } from 'react';
import './timeCountDown.scss';
type Props = {
	deadline: string;
	digitColor?: string;
	textColor?: string;
};

const TimeCountDown = ({ deadline, digitColor, textColor }: Props) => {
	const [fixedDate, setFixedDate] = useState<any>('');
	const [currentDate, setCurrentDate] = useState<any>('');
	const [diff, setDiff] = useState<any>(0);

	// set two digits
	const twoDigits = (value: number) => {
		if (value.toString().length <= 1) {
			return '0' + value.toString();
		}
		return value.toString();
	};

	// update seconds
	const seconds = () => Math.trunc(diff) % 60;
	// update minutes
	const minutes = () => Math.trunc(diff / 60) % 60;
	// update hours
	const hours = () => Math.trunc(diff / 60 / 60) % 24;
	// update days
	const days = () => Math.trunc(diff / 60 / 60 / 24);
	const setDayString = () => (days() > 1 ? 'days' : 'day');
	const setHourString = () => (hours() > 1 ? 'hours' : 'hour');

	useEffect(() => {
		let interval: any = 0;
		let proceed: boolean = true;

		const getDate = () => {
			let myPromise = new Promise((resolve: any, reject: any) => {
				if (deadline !== '') resolve(deadline);
				else reject(Error('Missing props "deadline'));
			});

			myPromise
				.then((time: any) => {
					const fixed = Math.trunc(Date.parse(time.replace(/-/g, '/')) / 1000);
					if (!fixed) throw new Error('Invalid props value, correct the deadline');
					else setFixedDate(fixed);

					interval = setInterval(() => {
						setCurrentDate(Math.trunc(new Date().getTime() / 1000));
					}, 1000);
				})
				.catch((err) => {
					throw new Error(err);
				});
		};

		if (fixedDate !== '' && currentDate !== '') {
			let resultDiff = fixedDate - currentDate;
			if (resultDiff <= 0) {
				proceed = false;
				setDiff(0);
			} else setDiff(resultDiff);
		}

		if (proceed) getDate();
		else clearInterval(interval);
	}, [currentDate, deadline, fixedDate]);

	// update show days
	const showDays = () => {
		if (days() > 0) {
			return (
				<li>
					<p>
						<span style={{ color: digitColor || '#000000' }} className='digit'>
							{twoDigits(days())}
						</span>
						<span style={{ color: textColor || '#848892' }} className='text'>
							{setDayString()}
						</span>
					</p>
				</li>
			);
		}
	};

	return (
		<div>
			<ul className='time'>
				{diff > 0 && showDays()}
				<li>
					<p>
						<span style={{ color: digitColor || '#000000' }} className='digit'>
							{diff > 0 ? twoDigits(hours()) : '00'}
						</span>
						<span style={{ color: textColor || '#848892' }} className='text'>
							{setHourString()}
						</span>
					</p>
				</li>
				<li>
					<p>
						<span style={{ color: digitColor || '#000000' }} className='digit'>
							{diff > 0 ? twoDigits(minutes()) : '00'}
						</span>
						<span style={{ color: textColor || '#848892' }} className='text'>
							min
						</span>
					</p>
				</li>
				<li>
					<p>
						<span style={{ color: digitColor || '#000000' }} className='digit'>
							{diff > 0 ? twoDigits(seconds()) : '00'}
						</span>
						<span style={{ color: textColor || '#848892' }} className='text'>
							Sec
						</span>
					</p>
				</li>
			</ul>
		</div>
	);
};

export default TimeCountDown;
