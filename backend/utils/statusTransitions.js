const validTransitions = {
  placed: ['preparing'],
  preparing: ['ready'],
  ready: ['delivered'],
  delivered: [], // Terminal state
};

function canTransition(currentStatus, newStatus) {
  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

module.exports = { validTransitions, canTransition };
