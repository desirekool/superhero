// const AvatarGenerator = (text?: string) => `https://api.dicebear.com/7.x/${text}/png`;

import { generate } from "random-words";

const AvatarGenerator = (text?: string) => `https://api.multiavatar.com/${text || generate()}.png`;

export default AvatarGenerator;