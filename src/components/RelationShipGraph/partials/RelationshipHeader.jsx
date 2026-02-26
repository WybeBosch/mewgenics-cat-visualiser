import React from 'react';

function RelationshipHeader({ activeRoom }) {
	return (
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
	);
}

export default RelationshipHeader;
