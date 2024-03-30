import { Orbis } from '@orbisclub/orbis-sdk';

export default async function (postId) {
  let orbis = new Orbis({
    useLit: true
  });
  let { data, error } = await orbis.getPost(postId);
  return data
}