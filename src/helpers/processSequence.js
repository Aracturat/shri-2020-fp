/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { allPass, andThen, compose, gt, ifElse, length, lt, otherwise, pipe, prop, tap, test } from 'ramda';

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	const isValid = allPass([
		compose(gt(10), length),
		compose(lt(2), length),
		test(/^(\d+\.)?\d+$/)
	]);

	const toNumber = value => Number(value);
	const toNearest = value => Math.round(value);
	const square = value => value * value;
	const mod3 = value => value % 3;

	const getAnimal = id => api.get(`https://animals.tech/${id}`, {});
	const convert = number => api.get('https://api.tech/numbers/base', { from: 10, to: 2, number });

	const runSquare = pipe(
		square,
		tap(writeLog)
	);

	const runGetAnimal = pipe(
		mod3,
		tap(writeLog),
		getAnimal,
		andThen(
			pipe(
				prop('result'),
				tap(handleSuccess)
			)
		),
		otherwise(tap(handleError))
	);

	const runConvert = pipe(
		convert,
		andThen(
			pipe(
				prop('result'),
				tap(writeLog),
				length,
				tap(writeLog),
				runSquare,
				runGetAnimal
			)
		),
		otherwise(tap(handleError)),
	);


	const runIfValid = pipe(
		toNumber,
		toNearest,
		tap(writeLog),
		runConvert
	);

	const showValidError = value => handleError('ValidationError');

	return pipe(
		tap(writeLog),
		ifElse(
			isValid,
			runIfValid,
			showValidError
		)
	)(value);
};

export default processSequence;
