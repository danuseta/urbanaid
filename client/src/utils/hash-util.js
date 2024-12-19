const hashId = (id) => {
  try {
    return `ua${id}x${Date.now()}`;
  } catch (error) {
    console.error('Error hashing ID:', error);
    return null;
  }
};

const unhashId = (hashedId) => {
  try {
    if (!hashedId || typeof hashedId !== 'string') {
      throw new Error('Invalid hashed ID');
    }

    if (!hashedId.startsWith('ua')) {
      throw new Error('Invalid hash format');
    }

    const id = hashedId.split('x')[0].substring(2);
    return parseInt(id, 10);
  } catch (error) {
    console.error('Error unhashing ID:', error);
    return null;
  }
};

export { hashId, unhashId };