const ratingColor = (rating) => {
    let rateClass;

    if (rating < 3) {
        rateClass = 'rating rating-up-to-three';
    } else if (rating >= 3 && rating < 5) {
        rateClass = 'rating rating-up-to-five';
    } else if (rating >= 5 && rating < 7) {
        rateClass = 'rating rating-up-to-seven';
    } else if (rating >= 7) {
        rateClass = 'rating rating-up-to-ten';
    }
    return rateClass;
};


export default ratingColor;