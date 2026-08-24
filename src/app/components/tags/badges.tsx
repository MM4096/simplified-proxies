import {ReactNode} from "react";

function BaseBadge({className, children}: {
	className: string,
	children: ReactNode,
}) {
	return (<span className={`badge badge-xs badge-outline ${className}`}>{children}</span>)
}


export function MTGBadge() {
	return (<BaseBadge className="badge-info">MTG</BaseBadge>)
}

export function PTCGBadge() {
	return (<BaseBadge className="badge-info">PTCG</BaseBadge>)
}

export function NewBadge() {
	return (<BaseBadge className="badge-success">New</BaseBadge>)
}

export function FeatureBadge() {
	return (<BaseBadge className="badge-success">Feature</BaseBadge>)
}

export function ExperimentalBadge() {
	return (<BaseBadge className="badge-warning">Experimental</BaseBadge>)
}

export function ChangeBadge() {
	return (<BaseBadge className="badge-warning">Change</BaseBadge>)
}

export function BugBadge() {
	return (<BaseBadge className="badge-error">Bug</BaseBadge>)
}