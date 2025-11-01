export const normalizeYaw = (yaw) => {
  if (yaw > 180) return yaw - 360;
  return yaw;
};
