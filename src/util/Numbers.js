export const round = (val, deci=0) => Math.round(val * 10**deci) / 10**deci;

export const clamp = (val, min=0, max=1) => val < min ? min : val > max ? max : val;
