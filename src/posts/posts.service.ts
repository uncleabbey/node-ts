import Post, { IPosts, PostDocument } from './posts.model';

export const findPostById = async (id: string): Promise<PostDocument | null> => {
  try {
    const post = await Post.findById(id).populate({
      path: 'author comments',
      populate: {
        path: 'user',
        select: '-password',
      },
      select: '-password',
    });
    return post;
  } catch (error) {
    return error;
  }
};

export const addPost = async (posts: IPosts): Promise<PostDocument | null> => {
  try {
    const post = new Post({ ...posts });
    await post.save();
    return post;
  } catch (error) {
    return error;
  }
};
type Tposts = {
  posts: PostDocument[];
  pages: number;
};
export const findAllPosts = async (limit: number, page: number): Promise<Tposts | void> => {
  try {
    return Post.find()
      .limit(limit)
      .skip(limit * page)
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: ['-password', '-__v', '-isAdmin'],
      })
      .exec((err, postLists) => {
        Post.countDocuments().exec((_err, count) => {
          const pages = count <= limit ? 1 : Math.ceil(count / limit);
          return { posts: postLists, pages };
        });
      });
  } catch (error) {
    return error;
  }
};
