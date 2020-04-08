/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
	__,
	allPass,
	compose,
	converge,
	curry,
	equals,
	filter,
	gte,
	includes,
	keys,
	length,
	prop
} from 'ramda';

import { COLORS, SHAPES } from '../constants';

const arrayOf = (...args) => args;

const equalsRed = equals(COLORS.RED);
const equalsBlue = equals(COLORS.BLUE);
const equalsOrange = equals(COLORS.ORANGE);
const equalsGreen = equals(COLORS.GREEN);
const equalsWhite = equals(COLORS.WHITE);

const propStar = prop(SHAPES.STAR);
const propSquare = prop(SHAPES.SQUARE);
const propTriangle = prop(SHAPES.TRIANGLE);
const propCircle = prop(SHAPES.CIRCLE);

const countOfKeys = compose(length, keys);
const countOfShapes = curry(compose(countOfKeys, filter));

const redCount = countOfShapes(equalsRed);
const blueCount = countOfShapes(equalsBlue);
const orangeCount = countOfShapes(equalsOrange);
const greenCount = countOfShapes(equalsGreen);
const whiteCount = countOfShapes(equalsWhite);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (props) => {
	const starIsRed = compose(equalsRed, propStar);
	const squareIsGreen = compose(equalsGreen, propSquare);
	const triangleIsWhite = compose(equalsWhite, propTriangle);
	const circleIsWhite = compose(equalsWhite, propCircle);

	return allPass([
		starIsRed,
		squareIsGreen,
		triangleIsWhite,
		circleIsWhite
	])(props);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (prop) => {
	const atLeastTwo = gte(__, 2);

	return compose(
		atLeastTwo,
		greenCount
	)(prop)
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (prop) => {
	return converge(
		equals,
		[blueCount, redCount]
	)(prop);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (prop) => {
	const circleIsBlue = compose(equalsBlue, propCircle);
	const starIsRed = compose(equalsRed, propStar);
	const squareIsOrange = compose(equalsOrange, propSquare);

	return allPass([
		circleIsBlue,
		starIsRed,
		squareIsOrange
	])(prop);
};

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = (prop) => {
	const includeThree = includes(3);

	const colorArray = converge(
		arrayOf,
		[redCount, blueCount, orangeCount, greenCount]
	);

	return compose(
		includeThree,
		colorArray
	)(prop);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = () => false;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = () => false;

// 8. Не красная и не белая звезда.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
export const validateFieldN9 = () => false;

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = () => false;
