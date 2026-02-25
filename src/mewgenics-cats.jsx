import { useState, useEffect } from 'react';

const STAT_ICONS = {
	STR: '💪',
	DEX: '🏹',
	CON: '➕',
	INT: '💡',
	SPD: '🥾',
	CHA: '💋',
	LCK: '🍀',
};
const STATS = ['STR', 'DEX', 'CON', 'INT', 'SPD', 'CHA', 'LCK'];

const SEX_ICON = { male: '♂', female: '♀', herm: '⚥' };
const SEX_COLOR = { male: '#60a5fa', female: '#f472b6', herm: '#c084fc' };
const SEX_BG = { male: '#1a2a4a', female: '#3b1a3b', herm: '#2a1a4a' };
const SEX_BG_HOVER = { male: '#2a3a6a', female: '#5a2a5a', herm: '#3b2a5a' };

const INITIAL_CATS = [
	{
		name: 'Snoozy',
		id: 'snoozy',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 6,
		LCK: 4,
		libido: 'average',
		libido_raw: 0.4264,
		aggression: 'high',
		aggression_raw: 0.723,
		loves: 'Madame Maxime',
		hates: 'Omry',
		room: 'Attic',
		stray: false,
		parent1: 'Lucille',
		parent2: 'Fatman',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Mijina',
		id: 'mijina',
		sex: 'female',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 6,
		LCK: 4,
		libido: 'average',
		libido_raw: 0.5437,
		aggression: 'low',
		aggression_raw: 0.2808,
		loves: 'Yuval',
		hates: 'Nyusha',
		room: 'Attic',
		stray: false,
		parent1: 'Lea',
		parent2: 'Snoozy',
		grandparent1: 'Estrella',
		grandparent2: 'Vegas',
		grandparent3: 'Lucille',
		grandparent4: 'Fatman',
		mutations: '',
	},
	{
		name: 'Scott',
		id: 'scott',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 5,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.5133,
		aggression: 'low',
		aggression_raw: 0.0981,
		loves: 'Miranda',
		hates: 'Yomayo',
		room: 'Attic',
		stray: false,
		parent1: 'Remie',
		parent2: 'Mungly Bungly',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Remi',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Mr. Meowsck',
		id: 'mr._meowsck',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 6,
		CHA: 5,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.6421,
		aggression: 'average',
		aggression_raw: 0.5779,
		loves: 'Mijina',
		hates: 'Yuval',
		room: 'Attic',
		stray: false,
		parent1: 'Miranda',
		parent2: 'Eren',
		grandparent1: 'Vegas',
		grandparent2: 'Humbert',
		grandparent3: 'Lecuna',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Stripers',
		id: 'stripers',
		sex: 'male',
		STR: 3,
		DEX: 5,
		CON: 6,
		INT: 5,
		SPD: 5,
		CHA: 4,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.4655,
		aggression: 'average',
		aggression_raw: 0.3409,
		loves: 'Zefirka',
		hates: 'Big John',
		room: 'Attic',
		stray: true,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Yaddiel',
		id: 'yaddiel',
		sex: 'male',
		STR: 4,
		DEX: 5,
		CON: 4,
		INT: 6,
		SPD: 5,
		CHA: 4,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.5132,
		aggression: 'low',
		aggression_raw: 0.2437,
		loves: 'Mijina',
		hates: 'Yuval',
		room: 'Attic',
		stray: true,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Milka',
		id: 'milka',
		sex: 'female',
		STR: 4,
		DEX: 4,
		CON: 4,
		INT: 6,
		SPD: 5,
		CHA: 7,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4195,
		aggression: 'low',
		aggression_raw: 0.2974,
		loves: 'Mungly Bungly',
		hates: '?key281',
		room: 'Attic',
		stray: true,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Tibb',
		id: 'tibb',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4105,
		aggression: 'high',
		aggression_raw: 0.9748,
		loves: 'Celica',
		hates: 'Yomayo',
		room: 'Attic',
		stray: false,
		parent1: 'Mijina',
		parent2: 'Mr. Meowsck',
		grandparent1: 'Lea',
		grandparent2: 'Snoozy',
		grandparent3: 'Miranda',
		grandparent4: 'Eren',
		mutations: '',
	},
	{
		name: 'Yuval',
		id: 'yuval',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 4,
		INT: 6,
		SPD: 6,
		CHA: 5,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.5869,
		aggression: 'average',
		aggression_raw: 0.4486,
		loves: 'Mijina',
		hates: 'Lashley',
		room: 'Attic',
		stray: false,
		parent1: 'Miranda',
		parent2: 'Omry',
		grandparent1: 'Vegas',
		grandparent2: 'Humbert',
		grandparent3: 'Madame Maxime',
		grandparent4: 'Solomon',
		mutations: '',
	},
	{
		name: 'Bigeon',
		id: 'bigeon',
		sex: 'herm',
		STR: 4,
		DEX: 4,
		CON: 4,
		INT: 7,
		SPD: 5,
		CHA: 5,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.5165,
		aggression: 'average',
		aggression_raw: 0.4272,
		loves: '',
		hates: 'Theft',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Milka',
		parent2: 'Mungly Bungly',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Remi',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Celica',
		id: 'celica',
		sex: 'female',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 6,
		CHA: 6,
		LCK: 4,
		libido: 'average',
		libido_raw: 0.6247,
		aggression: 'average',
		aggression_raw: 0.4946,
		loves: 'Mungly Bungly',
		hates: '?key281',
		room: 'Attic',
		stray: false,
		parent1: 'Mijina',
		parent2: 'Teo',
		grandparent1: 'Lea',
		grandparent2: 'Snoozy',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Shirotabi',
		id: 'shirotabi',
		sex: 'male',
		STR: 7,
		DEX: 4,
		CON: 5,
		INT: 5,
		SPD: 5,
		CHA: 6,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.6519,
		aggression: 'high',
		aggression_raw: 0.9984,
		loves: 'Celica',
		hates: 'Yomayo',
		room: 'Attic',
		stray: true,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Einar',
		id: 'einar',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 7,
		SPD: 6,
		CHA: 5,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4223,
		aggression: 'low',
		aggression_raw: 0.0217,
		loves: '',
		hates: '',
		room: 'Attic',
		stray: false,
		parent1: 'Celica',
		parent2: 'Mungly Bungly',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Remi',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Zara',
		id: 'zara',
		sex: 'female',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 6,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4095,
		aggression: 'high',
		aggression_raw: 0.9435,
		loves: 'Stripers',
		hates: 'Milka',
		room: 'Attic',
		stray: false,
		parent1: 'Mijina',
		parent2: 'Mr. Meowsck',
		grandparent1: 'Lea',
		grandparent2: 'Snoozy',
		grandparent3: 'Miranda',
		grandparent4: 'Eren',
		mutations: '',
	},
	{
		name: 'Girard',
		id: 'girard',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 6,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.3533,
		aggression: 'low',
		aggression_raw: 0.1686,
		loves: '',
		hates: 'Gideon',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Celica',
		parent2: 'Mungly Bungly',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Remi',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Lashley',
		id: 'lashley',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 6,
		CHA: 6,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.37,
		aggression: 'low',
		aggression_raw: 0.1416,
		loves: 'Mijina',
		hates: 'Yuval',
		room: 'Attic',
		stray: false,
		parent1: 'Zara',
		parent2: 'Stripers',
		grandparent1: 'Mijina',
		grandparent2: 'Mr. Meowsck',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Big John',
		id: 'big_john',
		sex: 'male',
		STR: 3,
		DEX: 5,
		CON: 7,
		INT: 5,
		SPD: 6,
		CHA: 4,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.3711,
		aggression: 'high',
		aggression_raw: 0.7738,
		loves: 'Milka',
		hates: 'Shirotabi',
		room: 'Attic',
		stray: false,
		parent1: 'Celica',
		parent2: 'Stripers',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Tums',
		id: 'tums',
		sex: 'herm',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 7,
		SPD: 6,
		CHA: 5,
		LCK: 4,
		libido: 'high',
		libido_raw: 0.8888,
		aggression: 'low',
		aggression_raw: 0.3126,
		loves: 'Rolo',
		hates: 'Ukiyo',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Celica',
		parent2: 'Mungly Bungly',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Remi',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Nouke',
		id: 'nouke',
		sex: 'herm',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 4,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.6455,
		aggression: 'low',
		aggression_raw: 0.0885,
		loves: 'Draks',
		hates: '',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Mijina',
		parent2: 'Yaddiel',
		grandparent1: 'Lea',
		grandparent2: 'Snoozy',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Rolo',
		id: 'rolo',
		sex: 'male',
		STR: 7,
		DEX: 6,
		CON: 4,
		INT: 4,
		SPD: 5,
		CHA: 6,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.466,
		aggression: 'high',
		aggression_raw: 0.8521,
		loves: 'Tums',
		hates: 'Mr. Meowsck',
		room: 'Floor1_Large',
		stray: true,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Draks',
		id: 'draks',
		sex: 'male',
		STR: 7,
		DEX: 6,
		CON: 7,
		INT: 7,
		SPD: 6,
		CHA: 5,
		LCK: 4,
		libido: 'low',
		libido_raw: 0.2765,
		aggression: 'high',
		aggression_raw: 0.9405,
		loves: 'Nouke',
		hates: 'Ukiyo',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Tums',
		parent2: 'Rolo',
		grandparent1: 'Celica',
		grandparent2: 'Mungly Bungly',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Chirya',
		id: 'chirya',
		sex: 'female',
		STR: 6,
		DEX: 4,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 6,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.4809,
		aggression: 'low',
		aggression_raw: 0.2891,
		loves: '',
		hates: 'Girard',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Zara',
		parent2: 'Shirotabi',
		grandparent1: 'Mijina',
		grandparent2: 'Mr. Meowsck',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Ukiyo',
		id: 'ukiyo',
		sex: 'female',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 7,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4857,
		aggression: 'average',
		aggression_raw: 0.5305,
		loves: 'Rolo',
		hates: 'Porter',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Milka',
		parent2: 'Scott',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Remie',
		grandparent4: 'Mungly Bungly',
		mutations: '',
	},
	{
		name: 'Mjollig',
		id: 'mjollig',
		sex: 'herm',
		STR: 6,
		DEX: 5,
		CON: 5,
		INT: 6,
		SPD: 6,
		CHA: 6,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.5219,
		aggression: 'average',
		aggression_raw: 0.5968,
		loves: '',
		hates: '',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Zara',
		parent2: 'Shirotabi',
		grandparent1: 'Mijina',
		grandparent2: 'Mr. Meowsck',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Bimba',
		id: 'bimba',
		sex: 'female',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 6,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4142,
		aggression: 'average',
		aggression_raw: 0.5353,
		loves: '',
		hates: 'Gideon',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Celica',
		parent2: 'Tibb',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Mijina',
		grandparent4: 'Mr. Meowsck',
		mutations: '',
	},
	{
		name: 'Tonetta',
		id: 'tonetta',
		sex: 'female',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 5,
		SPD: 5,
		CHA: 5,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.5327,
		aggression: 'average',
		aggression_raw: 0.4959,
		loves: '',
		hates: 'Cherry',
		room: 'Floor1_Small',
		stray: false,
		parent1: '?key281',
		parent2: 'Mungly Bungly',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Remi',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Tihon',
		id: 'tihon',
		sex: 'male',
		STR: 3,
		DEX: 7,
		CON: 5,
		INT: 5,
		SPD: 5,
		CHA: 5,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.4731,
		aggression: 'low',
		aggression_raw: 0.0232,
		loves: '',
		hates: 'Agnes',
		room: 'Attic',
		stray: true,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Allie Cat',
		id: 'allie_cat',
		sex: 'female',
		STR: 6,
		DEX: 6,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 4,
		LCK: 7,
		libido: 'high',
		libido_raw: 0.6994,
		aggression: 'low',
		aggression_raw: 0.3099,
		loves: '',
		hates: 'Bigeon',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Nouke',
		parent2: 'Draks',
		grandparent1: 'Mijina',
		grandparent2: 'Yaddiel',
		grandparent3: 'Tums',
		grandparent4: 'Rolo',
		mutations: '',
	},
	{
		name: 'Norburt',
		id: 'norburt',
		sex: 'male',
		STR: 4,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 7,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.3773,
		aggression: 'low',
		aggression_raw: 0.3148,
		loves: 'Rozi',
		hates: 'Girard',
		room: 'Attic',
		stray: false,
		parent1: 'Milka',
		parent2: 'Tibb',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Mijina',
		grandparent4: 'Mr. Meowsck',
		mutations: '',
	},
	{
		name: 'Rozi',
		id: 'rozi',
		sex: 'female',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 6,
		CHA: 5,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.3481,
		aggression: 'low',
		aggression_raw: 0.1748,
		loves: 'Norburt',
		hates: '',
		room: 'Attic',
		stray: false,
		parent1: 'Tums',
		parent2: 'Mr. Meowsck',
		grandparent1: 'Celica',
		grandparent2: 'Mungly Bungly',
		grandparent3: 'Miranda',
		grandparent4: 'Eren',
		mutations: '',
	},
	{
		name: 'Sabiha',
		id: 'sabiha',
		sex: 'female',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 6,
		LCK: 4,
		libido: 'average',
		libido_raw: 0.4746,
		aggression: 'low',
		aggression_raw: 0.0505,
		loves: '',
		hates: 'Chirya',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Celica',
		parent2: 'Yomayo',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Vegas',
		grandparent4: 'Allistair',
		mutations: '',
	},
	{
		name: 'Jon',
		id: 'jon',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 6,
		INT: 4,
		SPD: 5,
		CHA: 6,
		LCK: 5,
		libido: 'high',
		libido_raw: 0.7969,
		aggression: 'high',
		aggression_raw: 0.9474,
		loves: '',
		hates: '',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Celica',
		parent2: 'Yomayo',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Vegas',
		grandparent4: 'Allistair',
		mutations: '',
	},
	{
		name: 'Santo',
		id: 'santo',
		sex: 'male',
		STR: 4,
		DEX: 4,
		CON: 4,
		INT: 6,
		SPD: 6,
		CHA: 7,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.3487,
		aggression: 'average',
		aggression_raw: 0.593,
		loves: '',
		hates: 'Girard',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Milka',
		parent2: 'Big John',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Celica',
		grandparent4: 'Stripers',
		mutations: '',
	},
	{
		name: 'Lunch',
		id: 'lunch',
		sex: 'male',
		STR: 6,
		DEX: 6,
		CON: 7,
		INT: 6,
		SPD: 6,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.3981,
		aggression: 'low',
		aggression_raw: 0.1097,
		loves: '',
		hates: '',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Zara',
		parent2: 'Rolo',
		grandparent1: 'Mijina',
		grandparent2: 'Mr. Meowsck',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Tyger',
		id: 'tyger',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 5,
		LCK: 5,
		libido: 'high',
		libido_raw: 0.6965,
		aggression: 'average',
		aggression_raw: 0.5341,
		loves: '',
		hates: 'Dalton',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Celica',
		parent2: 'Yomayo',
		grandparent1: 'Mijina',
		grandparent2: 'Teo',
		grandparent3: 'Vegas',
		grandparent4: 'Allistair',
		mutations: '',
	},
	{
		name: 'Banana Peels',
		id: 'banana_peels',
		sex: 'herm',
		STR: 4,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 6,
		CHA: 7,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4708,
		aggression: 'average',
		aggression_raw: 0.6094,
		loves: '',
		hates: '',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Rozi',
		parent2: 'Norburt',
		grandparent1: 'Tums',
		grandparent2: 'Mr. Meowsck',
		grandparent3: 'Milka',
		grandparent4: 'Tibb',
		mutations: '',
	},
	{
		name: 'Dantes',
		id: 'dantes',
		sex: 'male',
		STR: 4,
		DEX: 5,
		CON: 6,
		INT: 6,
		SPD: 5,
		CHA: 7,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.4894,
		aggression: 'high',
		aggression_raw: 0.8846,
		loves: '',
		hates: '',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Milka',
		parent2: 'Stripers',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Brunetiere',
		id: 'brunetiere',
		sex: 'female',
		STR: 6,
		DEX: 7,
		CON: 3,
		INT: 6,
		SPD: 5,
		CHA: 6,
		LCK: 4,
		libido: 'average',
		libido_raw: 0.3675,
		aggression: 'average',
		aggression_raw: 0.3818,
		loves: '',
		hates: 'Mistglow',
		room: 'Attic',
		stray: false,
		parent1: 'Doris',
		parent2: 'Judd',
		grandparent1: '',
		grandparent2: '',
		grandparent3: 'Chuviha',
		grandparent4: 'Dudly',
		mutations: '',
	},
	{
		name: 'Shinji',
		id: 'shinji',
		sex: 'male',
		STR: 7,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 5,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.381,
		aggression: 'high',
		aggression_raw: 0.8286,
		loves: '',
		hates: '',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Ukiyo',
		parent2: 'Rolo',
		grandparent1: 'Milka',
		grandparent2: 'Scott',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Korihor',
		id: 'korihor',
		sex: 'male',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 6,
		CHA: 6,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4356,
		aggression: 'high',
		aggression_raw: 0.8021,
		loves: '',
		hates: '',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Zara',
		parent2: 'Tibb',
		grandparent1: 'Mijina',
		grandparent2: 'Mr. Meowsck',
		grandparent3: 'Mijina',
		grandparent4: 'Mr. Meowsck',
		mutations: '',
	},
	{
		name: 'Dutchess',
		id: 'dutchess',
		sex: 'female',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 4,
		LCK: 7,
		libido: 'average',
		libido_raw: 0.3539,
		aggression: 'high',
		aggression_raw: 0.9768,
		loves: '',
		hates: '',
		room: 'Floor1_Large',
		stray: false,
		parent1: 'Ukiyo',
		parent2: 'Nouke',
		grandparent1: 'Milka',
		grandparent2: 'Scott',
		grandparent3: 'Mijina',
		grandparent4: 'Yaddiel',
		mutations: '',
	},
	{
		name: 'Azi',
		id: 'azi',
		sex: 'herm',
		STR: 6,
		DEX: 5,
		CON: 7,
		INT: 4,
		SPD: 6,
		CHA: 5,
		LCK: 5,
		libido: 'average',
		libido_raw: 0.3595,
		aggression: 'low',
		aggression_raw: 0.1844,
		loves: '',
		hates: '',
		room: 'Attic',
		stray: false,
		parent1: 'Mijina',
		parent2: 'Yuval',
		grandparent1: 'Lea',
		grandparent2: 'Snoozy',
		grandparent3: 'Miranda',
		grandparent4: 'Omry',
		mutations: '',
	},
	{
		name: 'Jorj',
		id: 'jorj',
		sex: 'male',
		STR: 7,
		DEX: 4,
		CON: 4,
		INT: 6,
		SPD: 5,
		CHA: 6,
		LCK: 6,
		libido: 'low',
		libido_raw: 0.1802,
		aggression: 'high',
		aggression_raw: 0.9065,
		loves: '',
		hates: '',
		room: 'Attic',
		stray: false,
		parent1: 'Milka',
		parent2: 'Shirotabi',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
		mutations: '',
	},
	{
		name: 'Alonso',
		id: 'alonso',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 7,
		INT: 6,
		SPD: 5,
		CHA: 5,
		LCK: 6,
		libido: 'average',
		libido_raw: 0.4493,
		aggression: 'average',
		aggression_raw: 0.6376,
		loves: '',
		hates: '',
		room: 'Attic',
		stray: false,
		parent1: 'Rozi',
		parent2: 'Norburt',
		grandparent1: 'Tums',
		grandparent2: 'Mr. Meowsck',
		grandparent3: 'Milka',
		grandparent4: 'Tibb',
		mutations: '',
	},
	{
		name: 'Krenko',
		id: 'krenko',
		sex: 'male',
		STR: 7,
		DEX: 4,
		CON: 5,
		INT: 5,
		SPD: 6,
		CHA: 6,
		LCK: 4,
		libido: 'average',
		libido_raw: 0.4097,
		aggression: 'high',
		aggression_raw: 0.8323,
		loves: '',
		hates: '',
		room: 'Floor1_Small',
		stray: false,
		parent1: 'Bimba',
		parent2: 'Stickers',
		grandparent1: 'Celica',
		grandparent2: 'Tibb',
		grandparent3: 'Celica',
		grandparent4: 'Mungly Bungly',
		mutations: '',
	},
];

/* ─── Shared tooltip builder ─── */
function buildTooltipLines(cat, allCats) {
	const displayName = (n) => {
		if (!n) return null;
		const found = allCats.find((c) => c.name === n || c.id === n);
		return found ? found.name : n;
	};
	const isParentStray = (c, num) => {
		if (num === 1) return !c.grandparent1 && !c.grandparent2;
		return !c.grandparent3 && !c.grandparent4;
	};
	if (cat.stray) return [{ label: 'Stray', value: 'Yes' }];
	const lines = [];
	if (cat.parent1 || cat.parent2) {
		const p1 = cat.parent1
			? displayName(cat.parent1) + (isParentStray(cat, 1) ? ' (Stray)' : '')
			: '—';
		const p2 = cat.parent2
			? displayName(cat.parent2) + (isParentStray(cat, 2) ? ' (Stray)' : '')
			: '—';
		lines.push({ label: 'Parents', value: `${p1}  ×  ${p2}` });
	}
	const gps = [
		cat.grandparent1,
		cat.grandparent2,
		cat.grandparent3,
		cat.grandparent4,
	];
	if (gps.some((g) => g)) {
		const gpn = gps.map((g) => (g ? displayName(g) : '—'));
		lines.push({ label: 'GP (P1 side)', value: `${gpn[0]}  ×  ${gpn[1]}` });
		lines.push({ label: 'GP (P2 side)', value: `${gpn[2]}  ×  ${gpn[3]}` });
	}
	return lines;
}

/* ─── HTML tooltip for table ─── */
function NameCellTooltip({ cat, allCats }) {
	const [show, setShow] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const lines = buildTooltipLines(cat, allCats);
	return (
		<td
			style={{
				padding: '10px 12px',
				fontWeight: 600,
				color: '#fff',
				cursor: 'default',
			}}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
		>
			<span style={{ borderBottom: '1px dashed #666' }}>{cat.name}</span>
			{show && (
				<div
					style={{
						position: 'fixed',
						top: pos.y - 10,
						left: pos.x + 16,
						zIndex: 99999,
						transform: 'translateY(-100%)',
						background: '#1e1e3a',
						border: '1px solid #555',
						borderRadius: 8,
						padding: '10px 14px',
						minWidth: 220,
						pointerEvents: 'none',
						boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
					}}
				>
					<div
						style={{
							fontWeight: 700,
							fontSize: 13,
							color: '#fff',
							marginBottom: 6,
						}}
					>
						{cat.name}
					</div>
					{lines.map((line, i) => (
						<div
							key={i}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								gap: 12,
								fontSize: 11,
								marginBottom: 3,
							}}
						>
							<span style={{ color: '#888' }}>{line.label}:</span>
							<span style={{ color: '#ddd', textAlign: 'right' }}>
								{line.value}
							</span>
						</div>
					))}
				</div>
			)}
		</td>
	);
}

/* ─── Relationship Graph ─── */
function RelationshipGraph({ cats, allCats, hoveredCatId, setHoveredCatId }) {
	if (cats.length === 0)
		return (
			<p style={{ color: '#666', textAlign: 'center', padding: 40 }}>
				No cats in this room yet.
			</p>
		);

	// Reorder cats so mutual love pairs are adjacent
	const ordered = (() => {
		const pairs = [];
		const paired = new Set();
		cats.forEach((a) => {
			if (paired.has(a.id)) return;
			const match = cats.find(
				(b) =>
					b.id !== a.id &&
					a.loves &&
					b.loves &&
					a.loves === b.name &&
					b.loves === a.name
			);
			if (match && !paired.has(match.id)) {
				pairs.push([a, match]);
				paired.add(a.id);
				paired.add(match.id);
			}
		});
		const unpaired = cats.filter((c) => !paired.has(c.id));
		const result = [];
		let uIdx = 0;
		// Interleave pairs with unpaired cats around the circle
		for (const [a, b] of pairs) {
			result.push(a, b);
		}
		for (const c of unpaired) {
			result.push(c);
		}
		return result;
	})();

	const hovered = ordered.findIndex((c) => c.id === hoveredCatId);
	const hovIdx = hovered >= 0 ? hovered : null;

	const W = 800,
		H = 500;
	const cx = W / 2,
		cy = H / 2;
	const radius = Math.min(200, 60 + ordered.length * 12);

	const positions = ordered.map((cat, i) => {
		const angle = (i / ordered.length) * 2 * Math.PI - Math.PI / 2;
		return {
			name: cat.name,
			sex: cat.sex,
			x: cx + radius * Math.cos(angle),
			y: cy + radius * Math.sin(angle),
		};
	});

	const findPos = (name) => {
		if (!name) return null;
		const clean = name.replace(/\s*☠️/g, '').trim().toLowerCase();
		return positions.find((p) => p.name.toLowerCase() === clean);
	};

	const edges = [];
	ordered.forEach((cat) => {
		const from = findPos(cat.name);
		if (!from) return;
		if (cat.loves) {
			const to = findPos(cat.loves);
			if (to) edges.push({ from, to, type: 'love' });
		}
		if (cat.hates) {
			const to = findPos(cat.hates);
			if (to) edges.push({ from, to, type: 'hate' });
		}
	});

	const getPath = (from, to, type) => {
		const dx = to.x - from.x,
			dy = to.y - from.y;
		const dist = Math.sqrt(dx * dx + dy * dy) || 1;
		const nodeR = 28;
		const x1 = from.x + dx * (nodeR / dist),
			y1 = from.y + dy * (nodeR / dist);
		const x2 = from.x + dx * ((dist - nodeR) / dist),
			y2 = from.y + dy * ((dist - nodeR) / dist);
		const mx = (x1 + x2) / 2,
			my = (y1 + y2) / 2;
		const offset = type === 'love' ? 25 : -25;
		return {
			x1,
			y1,
			x2,
			y2,
			cx: mx + (-dy / dist) * offset,
			cy: my + (dx / dist) * offset,
		};
	};

	const buildTooltip = (cat) => buildTooltipLines(cat, allCats);

	return (
		<div
			style={{
				background: '#1a1a2e',
				borderRadius: 12,
				border: '1px solid #333',
				padding: 16,
				display: 'flex',
				justifyContent: 'center',
				position: 'relative',
			}}
		>
			<svg
				width={W}
				height={H}
				viewBox={`0 0 ${W} ${H}`}
				style={{ maxWidth: '100%' }}
			>
				<defs>
					<marker
						id="arrow-love"
						viewBox="0 0 10 6"
						refX="10"
						refY="3"
						markerWidth="8"
						markerHeight="6"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 3 L 0 6 z" fill="#4ade80" />
					</marker>
					<marker
						id="arrow-hate"
						viewBox="0 0 10 6"
						refX="10"
						refY="3"
						markerWidth="8"
						markerHeight="6"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 3 L 0 6 z" fill="#ef4444" />
					</marker>
				</defs>

				{edges.map((e, i) => {
					const p = getPath(e.from, e.to, e.type);
					return (
						<path
							key={i}
							d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
							fill="none"
							stroke={e.type === 'love' ? '#4ade80' : '#ef4444'}
							strokeWidth={2}
							strokeDasharray={e.type === 'hate' ? '6,4' : 'none'}
							markerEnd={`url(#arrow-${e.type})`}
							opacity={0.7}
						/>
					);
				})}

				{/* External relations */}
				{ordered.map((cat, i) => {
					const from = positions[i];
					const externals = [];
					if (cat.loves && !findPos(cat.loves))
						externals.push({ label: cat.loves, type: 'love' });
					if (cat.hates && !findPos(cat.hates))
						externals.push({ label: cat.hates, type: 'hate' });
					return externals.map((ext, j) => {
						const angle = Math.atan2(from.y - cy, from.x - cx);
						const outX = from.x + 55 * Math.cos(angle) + j * 20;
						const outY = from.y + 55 * Math.sin(angle) + j * 14;
						const color = ext.type === 'love' ? '#4ade80' : '#ef4444';
						return (
							<g key={`ext-${i}-${j}`}>
								<line
									x1={from.x + 28 * Math.cos(angle)}
									y1={from.y + 28 * Math.sin(angle)}
									x2={outX}
									y2={outY}
									stroke={color}
									strokeWidth={1.5}
									strokeDasharray={ext.type === 'hate' ? '4,3' : 'none'}
									opacity={0.5}
								/>
								<text
									x={outX + 8 * Math.cos(angle)}
									y={outY + 8 * Math.sin(angle)}
									textAnchor="middle"
									fill={color}
									fontSize={11}
									fontStyle="italic"
									dominantBaseline="middle"
								>
									{ext.type === 'love' ? '❤️' : '💔'} {ext.label}
								</text>
							</g>
						);
					});
				})}

				{/* Shared lineage lines on hover */}
				{hovIdx !== null &&
					(() => {
						const hovCat = ordered[hovIdx];
						const hovAnc = [
							hovCat.parent1,
							hovCat.parent2,
							hovCat.grandparent1,
							hovCat.grandparent2,
							hovCat.grandparent3,
							hovCat.grandparent4,
						].filter(Boolean);
						return ordered.map((other, oi) => {
							if (oi === hovIdx) return null;
							const from = positions[hovIdx],
								to = positions[oi];
							const hovIsParent =
								other.parent1 === hovCat.name || other.parent2 === hovCat.name;
							const otherIsParent =
								hovCat.parent1 === other.name || hovCat.parent2 === other.name;
							if (hovIsParent || otherIsParent) {
								return (
									<g key={`kin-${oi}`}>
										<line
											x1={from.x}
											y1={from.y}
											x2={to.x}
											y2={to.y}
											stroke="#f97316"
											strokeWidth={3}
											opacity={0.6}
										/>
										<text
											x={(from.x + to.x) / 2}
											y={(from.y + to.y) / 2 - 8}
											textAnchor="middle"
											fontSize={9}
											fill="#f97316"
											opacity={0.8}
										>
											parent
										</text>
									</g>
								);
							}
							const otherAnc = [
								other.parent1,
								other.parent2,
								other.grandparent1,
								other.grandparent2,
								other.grandparent3,
								other.grandparent4,
							].filter(Boolean);
							const shared = hovAnc.filter((a) => otherAnc.includes(a));
							if (shared.length === 0) return null;
							const isSibling = shared.some(
								(s) =>
									[hovCat.parent1, hovCat.parent2].includes(s) &&
									[other.parent1, other.parent2].includes(s)
							);
							return (
								<g key={`kin-${oi}`}>
									<line
										x1={from.x}
										y1={from.y}
										x2={to.x}
										y2={to.y}
										stroke={isSibling ? '#fbbf24' : '#a78bfa'}
										strokeWidth={isSibling ? 3 : 2}
										strokeDasharray={isSibling ? 'none' : '8,4'}
										opacity={0.6}
									/>
									<text
										x={(from.x + to.x) / 2}
										y={(from.y + to.y) / 2 - 8}
										textAnchor="middle"
										fontSize={9}
										fill={isSibling ? '#fbbf24' : '#a78bfa'}
										opacity={0.8}
									>
										{isSibling ? 'sibling' : 'related'}
									</text>
								</g>
							);
						});
					})()}

				{positions.map((p, i) => (
					<g
						key={p.name}
						onMouseEnter={() => setHoveredCatId(ordered[i].id)}
						onMouseLeave={() => setHoveredCatId(null)}
						style={{ cursor: 'pointer' }}
					>
						<circle
							cx={p.x}
							cy={p.y}
							r={28}
							fill={
								hovIdx === i
									? SEX_BG_HOVER[ordered[i].sex]
									: SEX_BG[ordered[i].sex]
							}
							stroke={SEX_COLOR[ordered[i].sex]}
							strokeWidth={hovIdx === i ? 3.5 : 2.5}
						/>
						<text
							x={p.x}
							y={p.y - 2}
							textAnchor="middle"
							dominantBaseline="middle"
							fill="#fff"
							fontSize={
								ordered[i].name.length > 10
									? 8
									: ordered[i].name.length > 8
										? 9
										: 11
							}
							fontWeight={600}
						>
							{ordered[i].name.length > 14
								? ordered[i].name.slice(0, 13) + '…'
								: ordered[i].name}
						</text>
						<text
							x={p.x}
							y={p.y + 12}
							textAnchor="middle"
							fill={SEX_COLOR[ordered[i].sex]}
							fontSize={10}
						>
							{SEX_ICON[ordered[i].sex] || ordered[i].sex}
						</text>
					</g>
				))}

				{/* Tooltip */}
				{hovIdx !== null &&
					(() => {
						const cat = ordered[hovIdx],
							pos = positions[hovIdx];
						const lines = buildTooltip(cat);
						const tipW = 220,
							tipH = 20 + lines.length * 22;
						let tx = pos.x - tipW / 2,
							ty = pos.y - 40 - tipH;
						if (ty < 5) ty = pos.y + 38;
						if (tx < 5) tx = 5;
						if (tx + tipW > W - 5) tx = W - tipW - 5;
						return (
							<g>
								<rect
									x={tx}
									y={ty}
									width={tipW}
									height={tipH}
									rx={8}
									fill="#1e1e3a"
									stroke="#555"
									strokeWidth={1}
									opacity={0.95}
								/>
								<text
									x={tx + tipW / 2}
									y={ty + 16}
									textAnchor="middle"
									fill="#fff"
									fontSize={12}
									fontWeight={700}
								>
									{cat.name}
								</text>
								{lines.map((line, li) => (
									<g key={li}>
										<text
											x={tx + 10}
											y={ty + 36 + li * 22}
											fill="#888"
											fontSize={10}
										>
											{line.label}:
										</text>
										<text
											x={tx + tipW - 10}
											y={ty + 36 + li * 22}
											textAnchor="end"
											fill="#ddd"
											fontSize={10}
										>
											{line.value}
										</text>
									</g>
								))}
							</g>
						);
					})()}

				<g transform={`translate(16, ${H - 50})`}>
					<line x1={0} y1={0} x2={30} y2={0} stroke="#4ade80" strokeWidth={2} />
					<text x={36} y={4} fill="#aaa" fontSize={11}>
						Loves
					</text>
					<line
						x1={100}
						y1={0}
						x2={130}
						y2={0}
						stroke="#ef4444"
						strokeWidth={2}
						strokeDasharray="6,4"
					/>
					<text x={136} y={4} fill="#aaa" fontSize={11}>
						Hates
					</text>
					<circle
						cx={230}
						cy={0}
						r={6}
						fill="#3b1a3b"
						stroke="#f472b6"
						strokeWidth={1.5}
					/>
					<text x={242} y={4} fill="#aaa" fontSize={11}>
						Female
					</text>
					<circle
						cx={300}
						cy={0}
						r={6}
						fill="#1a2a4a"
						stroke="#60a5fa"
						strokeWidth={1.5}
					/>
					<text x={312} y={4} fill="#aaa" fontSize={11}>
						Male
					</text>
					<circle
						cx={370}
						cy={0}
						r={6}
						fill="#2a1a4a"
						stroke="#c084fc"
						strokeWidth={1.5}
					/>
					<text x={382} y={4} fill="#aaa" fontSize={11}>
						Herm
					</text>
					<line
						x1={440}
						y1={0}
						x2={470}
						y2={0}
						stroke="#f97316"
						strokeWidth={3}
					/>
					<text x={476} y={4} fill="#aaa" fontSize={11}>
						Parent
					</text>
					<line
						x1={540}
						y1={0}
						x2={570}
						y2={0}
						stroke="#fbbf24"
						strokeWidth={3}
					/>
					<text x={576} y={4} fill="#aaa" fontSize={11}>
						Sibling
					</text>
					<line
						x1={640}
						y1={0}
						x2={670}
						y2={0}
						stroke="#a78bfa"
						strokeWidth={2}
						strokeDasharray="8,4"
					/>
					<text x={676} y={4} fill="#aaa" fontSize={11}>
						Related
					</text>
				</g>
			</svg>
		</div>
	);
}

/* ─── Main App ─── */
export default function MewgenicsCats() {
	const [cats, setCats] = useState(INITIAL_CATS);
	const [rooms, setRooms] = useState([]);
	const [activeRoom, setActiveRoom] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editIdx, setEditIdx] = useState(null);
	const emptyForm = {
		name: '',
		id: '',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 5,
		INT: 5,
		SPD: 5,
		CHA: 5,
		LCK: 5,
		libido: 5,
		aggression: 5,
		loves: '',
		hates: '',
		mutations: '',
		room: '',
		stray: false,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
	};
	const [form, setForm] = useState({ ...emptyForm });
	const [sortCol, setSortCol] = useState(null);
	const [sortAsc, setSortAsc] = useState(true);
	const [copied, setCopied] = useState(false);
	const [showAddRoom, setShowAddRoom] = useState(false);
	const [newRoomName, setNewRoomName] = useState('');
	const [hoveredCatId, setHoveredCatId] = useState(null);

	// Derive rooms from cats
	useEffect(() => {
		const r = [...new Set(cats.map((c) => c.room))];
		setRooms(r);
		if (!r.includes(activeRoom)) setActiveRoom(r[0] || '');
	}, [cats]);

	// Load
	useEffect(() => {
		(async () => {
			try {
				const result = await window.storage.get('mewgenics-v13');
				if (result?.value) {
					const data = JSON.parse(result.value);
					if (data.cats) setCats(data.cats);
				}
			} catch {}
			setLoaded(true);
		})();
	}, []);

	// Save
	useEffect(() => {
		if (!loaded) return;
		(async () => {
			try {
				await window.storage.set('mewgenics-v13', JSON.stringify({ cats }));
			} catch {}
		})();
	}, [cats, loaded]);

	const resetForm = () => setForm({ ...emptyForm, room: activeRoom });

	const handleAdd = () => {
		if (!form.name.trim()) return;
		const entry = { ...form, name: form.name.trim() };
		entry.id = entry.name
			.toLowerCase()
			.replace(/[^a-z0-9_.]/g, (c) => (c === ' ' ? '_' : c === '.' ? '.' : ''));
		STATS.forEach((s) => (entry[s] = Number(entry[s])));
		entry.libido = Number(entry.libido);
		entry.aggression = Number(entry.aggression);
		if (editIdx !== null) {
			const u = [...cats];
			u[editIdx] = entry;
			setCats(u);
			setEditIdx(null);
		} else setCats([...cats, entry]);
		resetForm();
		setShowForm(false);
	};

	const handleEdit = (gi) => {
		setForm({ ...cats[gi] });
		setEditIdx(gi);
		setShowForm(true);
	};
	const handleDelete = (gi) => setCats(cats.filter((_, i) => i !== gi));
	const handleSort = (col) => {
		if (sortCol === col) setSortAsc(!sortAsc);
		else {
			setSortCol(col);
			setSortAsc(col === 'name' || col === 'sex');
		}
	};

	const handleAddRoom = () => {
		const t = newRoomName.trim();
		if (!t || rooms.includes(t)) return;
		// Add a placeholder cat to create the room, then remove it — or just set active
		setNewRoomName('');
		setShowAddRoom(false);
		setActiveRoom(t);
		// Rooms derive from cats, so we need at least one cat. We'll add room to the list manually.
		setRooms([...rooms, t]);
	};

	const totalStat = (cat) => STATS.reduce((sum, s) => sum + cat[s], 0);
	const roomCats = cats.filter((c) => c.room === activeRoom);

	const sorted = [...roomCats].sort((a, b) => {
		if (!sortCol) return 0;
		if (sortCol === 'total')
			return sortAsc
				? totalStat(a) - totalStat(b)
				: totalStat(b) - totalStat(a);
		const av = a[sortCol],
			bv = b[sortCol];
		if (typeof av === 'string')
			return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
		return sortAsc ? av - bv : bv - av;
	});

	const tabStyle = (room) => ({
		padding: '10px 20px',
		background: activeRoom === room ? '#6366f1' : '#252547',
		color: activeRoom === room ? '#fff' : '#aaa',
		border: 'none',
		borderRadius: '8px 8px 0 0',
		cursor: 'pointer',
		fontWeight: activeRoom === room ? 700 : 500,
		fontSize: 14,
		transition: 'background 0.15s',
	});

	const aggroLabel = (v) => (v <= 3 ? 'Low' : v <= 6 ? 'Mid' : 'High');
	const aggroColor = (v) => (v <= 3 ? '#86efac' : v <= 6 ? '#ccc' : '#f87171');

	return (
		<div
			style={{
				fontFamily: "'Inter', system-ui, sans-serif",
				background: '#1a1a2e',
				minHeight: '100vh',
				color: '#e0e0e0',
				padding: '24px',
			}}
		>
			<div style={{ margin: '0 auto' }}>
				{/* Header */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 16,
					}}
				>
					<div>
						<h1
							style={{
								fontSize: 28,
								fontWeight: 700,
								color: '#fff',
								margin: 0,
							}}
						>
							🐱 Mewgenics Cat Tracker
						</h1>
						<p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
							{cats.length} total cats across {rooms.length} rooms
						</p>
					</div>
					<div style={{ display: 'flex', gap: 10 }}>
						<button
							onClick={() => {
								const header = [
									'Name',
									'ID',
									'Sex',
									...STATS,
									'Total',
									'Libido',
									'Aggro',
									'Loves',
									'Hates',
									'Mutations',
									'Room',
									'Stray',
									'P1',
									'P2',
									'GP1',
									'GP2',
									'GP3',
									'GP4',
								].join(' | ');
								const div = header.replace(/[^|]/g, '-');
								const rows = cats.map((c) =>
									[
										c.name,
										c.id,
										c.sex,
										...STATS.map((s) => c[s]),
										totalStat(c),
										c.libido,
										c.aggression,
										c.loves || '—',
										c.hates || '—',
										c.mutations || '—',
										c.room,
										c.stray ? 'yes' : 'no',
										c.parent1 || '—',
										c.parent2 || '—',
										c.grandparent1 || '—',
										c.grandparent2 || '—',
										c.grandparent3 || '—',
										c.grandparent4 || '—',
									].join(' | ')
								);
								navigator.clipboard.writeText(
									`Mewgenics Cat Roster (${cats.length} cats)\nBase stats only. Stats ~1-10, 7+ strong. Libido/Aggro 1-10.\nRooms: ${rooms.join(', ')}\n\n${header}\n${div}\n${rows.join('\n')}`
								);
								setCopied(true);
								setTimeout(() => setCopied(false), 2000);
							}}
							style={{
								background: copied ? '#16a34a' : '#374151',
								color: '#fff',
								border: 'none',
								borderRadius: 8,
								padding: '10px 20px',
								cursor: 'pointer',
								fontWeight: 600,
								fontSize: 14,
							}}
						>
							{copied ? '✅ Copied!' : '📋 Copy All'}
						</button>
						<button
							onClick={() => {
								resetForm();
								setEditIdx(null);
								setShowForm(!showForm);
							}}
							style={{
								background: showForm ? '#444' : '#6366f1',
								color: '#fff',
								border: 'none',
								borderRadius: 8,
								padding: '10px 20px',
								cursor: 'pointer',
								fontWeight: 600,
								fontSize: 14,
							}}
						>
							{showForm ? 'Cancel' : '+ Add Cat'}
						</button>
					</div>
				</div>

				{/* Room Tabs */}
				<div
					style={{
						display: 'flex',
						alignItems: 'end',
						gap: 4,
						borderBottom: '2px solid #333',
					}}
				>
					{rooms.map((room) => (
						<div key={room} style={{ position: 'relative' }}>
							<button
								onClick={() => setActiveRoom(room)}
								style={tabStyle(room)}
							>
								{room}{' '}
								<span style={{ marginLeft: 8, fontSize: 12, opacity: 0.6 }}>
									({cats.filter((c) => c.room === room).length})
								</span>
							</button>
						</div>
					))}
					{showAddRoom ? (
						<div
							style={{
								display: 'flex',
								gap: 4,
								padding: '6px 0',
								marginLeft: 4,
							}}
						>
							<input
								autoFocus
								value={newRoomName}
								onChange={(e) => setNewRoomName(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
								placeholder="Room name"
								style={{
									background: '#252547',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '6px 10px',
									color: '#fff',
									fontSize: 13,
									width: 130,
								}}
							/>
							<button
								onClick={handleAddRoom}
								style={{
									background: '#16a34a',
									color: '#fff',
									border: 'none',
									borderRadius: 6,
									padding: '6px 12px',
									cursor: 'pointer',
									fontSize: 13,
								}}
							>
								Add
							</button>
							<button
								onClick={() => {
									setShowAddRoom(false);
									setNewRoomName('');
								}}
								style={{
									background: '#444',
									color: '#fff',
									border: 'none',
									borderRadius: 6,
									padding: '6px 12px',
									cursor: 'pointer',
									fontSize: 13,
								}}
							>
								✕
							</button>
						</div>
					) : (
						<button
							onClick={() => setShowAddRoom(true)}
							style={{
								padding: '10px 16px',
								background: 'none',
								color: '#666',
								border: 'none',
								cursor: 'pointer',
								fontSize: 18,
								lineHeight: 1,
							}}
							title="Add room"
						>
							+
						</button>
					)}
				</div>

				{/* Add/Edit Form */}
				{showForm && (
					<div
						style={{
							background: '#252547',
							borderRadius: '0 0 12px 12px',
							padding: 20,
							marginBottom: 20,
							border: '1px solid #333',
							borderTop: 'none',
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: 12,
								flexWrap: 'wrap',
								alignItems: 'end',
							}}
						>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									Name
								</label>
								<input
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									placeholder="Cat name"
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 140,
									}}
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									Sex
								</label>
								<select
									value={form.sex}
									onChange={(e) => setForm({ ...form, sex: e.target.value })}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
									}}
								>
									<option value="male">♂ Male</option>
									<option value="female">♀ Female</option>
									<option value="herm">⚥ Herm</option>
								</select>
							</div>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									🏠 Room
								</label>
								<select
									value={form.room}
									onChange={(e) => setForm({ ...form, room: e.target.value })}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
									}}
								>
									{rooms.map((r) => (
										<option key={r} value={r}>
											{r}
										</option>
									))}
								</select>
							</div>
							{STATS.map((s) => (
								<div key={s}>
									<label
										style={{
											fontSize: 12,
											color: '#aaa',
											display: 'block',
											marginBottom: 4,
										}}
									>
										{STAT_ICONS[s]} {s}
									</label>
									<input
										type="number"
										min={1}
										max={10}
										value={form[s]}
										onChange={(e) => setForm({ ...form, [s]: e.target.value })}
										style={{
											background: '#1a1a2e',
											border: '1px solid #444',
											borderRadius: 6,
											padding: '8px 12px',
											color: '#fff',
											width: 60,
										}}
									/>
								</div>
							))}
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									💕 Libido
								</label>
								<input
									type="number"
									min={1}
									max={10}
									value={form.libido}
									onChange={(e) => setForm({ ...form, libido: e.target.value })}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 60,
									}}
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									😾 Aggro
								</label>
								<input
									type="number"
									min={1}
									max={10}
									value={form.aggression}
									onChange={(e) =>
										setForm({ ...form, aggression: e.target.value })
									}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 60,
									}}
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									❤️ Loves
								</label>
								<input
									value={form.loves}
									onChange={(e) => setForm({ ...form, loves: e.target.value })}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 120,
									}}
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									💔 Hates
								</label>
								<input
									value={form.hates}
									onChange={(e) => setForm({ ...form, hates: e.target.value })}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 120,
									}}
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									🧬 Mutations
								</label>
								<input
									value={form.mutations}
									onChange={(e) =>
										setForm({ ...form, mutations: e.target.value })
									}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 120,
									}}
								/>
							</div>
							<button
								onClick={handleAdd}
								style={{
									background: '#16a34a',
									color: '#fff',
									border: 'none',
									borderRadius: 6,
									padding: '8px 20px',
									cursor: 'pointer',
									fontWeight: 600,
									height: 38,
								}}
							>
								{editIdx !== null ? 'Save' : 'Add'}
							</button>
						</div>
					</div>
				)}

				{/* Table */}
				<div
					style={{
						overflowX: 'auto',
						border: '1px solid #333',
						borderTop: 'none',
					}}
				>
					<table
						style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}
					>
						<thead>
							<tr style={{ background: '#252547' }}>
								{[
									{ key: 'name', label: 'Name' },
									{ key: 'sex', label: 'Sex' },
									...STATS.map((s) => ({
										key: s,
										label: `${STAT_ICONS[s]} ${s}`,
									})),
									{ key: 'total', label: 'Total' },
									{ key: 'libido', label: '💕' },
									{ key: 'aggression', label: '😾' },
									{ key: 'loves', label: '❤️' },
									{ key: 'hates', label: '💔' },
									{ key: 'mutations', label: '🧬' },
									{ key: 'actions', label: '' },
								].map((col) => (
									<th
										key={col.key}
										onClick={
											col.key !== 'actions'
												? () => handleSort(col.key)
												: undefined
										}
										style={{
											padding: '12px 12px',
											textAlign: col.key === 'name' ? 'left' : 'center',
											cursor: col.key !== 'actions' ? 'pointer' : 'default',
											userSelect: 'none',
											fontWeight: 600,
											color: sortCol === col.key ? '#6366f1' : '#aaa',
											fontSize: 13,
											borderBottom: '2px solid #333',
											whiteSpace: 'nowrap',
										}}
									>
										{col.label}{' '}
										{sortCol === col.key ? (sortAsc ? '▲' : '▼') : ''}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{sorted.length === 0 && (
								<tr>
									<td
										colSpan={14}
										style={{ padding: 40, textAlign: 'center', color: '#666' }}
									>
										No cats in this room.
									</td>
								</tr>
							)}
							{sorted.map((cat, i) => {
								const gi = cats.indexOf(cat);
								const total = totalStat(cat);
								const isHovered = hoveredCatId === cat.id;
								const rowBg = isHovered
									? '#2a2a5a'
									: i % 2 === 0
										? '#1a1a2e'
										: '#1f1f3a';
								return (
									<tr
										key={cat.id + i}
										style={{
											background: rowBg,
											borderBottom: '1px solid #2a2a4a',
											transition: 'background 0.1s',
										}}
										onMouseEnter={() => setHoveredCatId(cat.id)}
										onMouseLeave={() => setHoveredCatId(null)}
									>
										<NameCellTooltip cat={cat} allCats={cats} />
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												color: SEX_COLOR[cat.sex],
											}}
										>
											{SEX_ICON[cat.sex] || cat.sex}
										</td>
										{STATS.map((s) => (
											<td
												key={s}
												style={{
													padding: '10px 12px',
													textAlign: 'center',
													fontVariantNumeric: 'tabular-nums',
													fontWeight: cat[s] >= 7 ? 800 : 400,
													color: cat[s] >= 7 ? '#4ade80' : '#ccc',
													fontSize: cat[s] >= 7 ? '1.05em' : '1em',
												}}
											>
												{cat[s]}
											</td>
										))}
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontWeight: 600,
												color: '#a78bfa',
											}}
										>
											{total}
										</td>
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontSize: 12,
												color: '#ccc',
											}}
										>
											{cat.libido}
										</td>
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontSize: 12,
												color: aggroColor(cat.aggression),
											}}
										>
											{cat.aggression}
										</td>
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontSize: 12,
												color: '#a7f3d0',
												whiteSpace: 'nowrap',
											}}
										>
											{cat.loves || '—'}
										</td>
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontSize: 12,
												color: '#fca5a5',
												whiteSpace: 'nowrap',
											}}
										>
											{cat.hates || '—'}
										</td>
										<td
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontSize: 12,
												color: '#93c5fd',
												whiteSpace: 'nowrap',
											}}
										>
											{cat.mutations || '—'}
										</td>
										<td
											style={{
												padding: '10px 8px',
												textAlign: 'center',
												whiteSpace: 'nowrap',
											}}
										>
											<button
												onClick={() => handleEdit(gi)}
												style={{
													background: 'none',
													border: 'none',
													color: '#6366f1',
													cursor: 'pointer',
													fontSize: 13,
													marginRight: 8,
												}}
											>
												✏️
											</button>
											<button
												onClick={() => handleDelete(gi)}
												style={{
													background: 'none',
													border: 'none',
													color: '#ef4444',
													cursor: 'pointer',
													fontSize: 13,
												}}
											>
												🗑️
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<p
					style={{
						color: '#555',
						fontSize: 12,
						marginTop: 12,
						textAlign: 'center',
					}}
				>
					Click column headers to sort • Data saves automatically between
					sessions
				</p>

				{/* Relationship Graph */}
				<div style={{ marginTop: 32 }}>
					<h2
						style={{
							fontSize: 20,
							fontWeight: 700,
							color: '#fff',
							marginBottom: 16,
						}}
					>
						💞 {activeRoom} — Relationships
					</h2>
					<RelationshipGraph
						cats={roomCats}
						allCats={cats}
						hoveredCatId={hoveredCatId}
						setHoveredCatId={setHoveredCatId}
					/>
				</div>
			</div>
		</div>
	);
}
