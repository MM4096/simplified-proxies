function checkOverflow(element: HTMLElement): boolean {
	if (!element) {
		return false;
	}

	// temp set overflow to shown
	const original_overflow = element.style.overflow;
	element.style.overflow = "hidden";

	const is_overflowing = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;

	element.style.overflow = original_overflow;

	return is_overflowing;
}