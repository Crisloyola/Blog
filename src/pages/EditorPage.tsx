import { useEffect, useState } from "react";
import { createPost, getPosts, createComment, getComments, deletePost } from "../api/posts.api";
import { useAuth } from "../context/AuthContext";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  category: string;
  content: string;
  publishDate: string;
  authorId: string;
}

interface Comment {
  id: number;
  commentDate: string;
  content: string;
  userName: string;
  postId: number;
}

const navigation = [
  { name: 'Posts', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function EditorPage() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getPosts(token).then(async (fetchedPosts: Post[]) => {
        setPosts(fetchedPosts);
        // Fetch comments for each post
        const commentsPromises = fetchedPosts.map(post => getComments(post.id, token));
        const commentsResults = await Promise.all(commentsPromises);
        const commentsMap: { [postId: number]: Comment[] } = {};
        fetchedPosts.forEach((post: Post, index: number) => {
          commentsMap[post.id] = commentsResults[index];
        });
        setComments(commentsMap);
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    try {
      await createPost(title, category, content, user.id, token);
      setTitle("");
      setCategory("");
      setContent("");
      // Refresh posts
      const updatedPosts = await getPosts(token);
      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error al crear post" + { error });
    }
  };

  const handleComment = async (postId: number) => {
    if (!token || !user) return;

    const content = commentTexts[postId];
    if (!content) return;

    try {
      const userName = `${user.firstName} ${user.lastName}`;
      await createComment(postId, content, userName, token);
      // Refresh comments for this post
      const updatedComments = await getComments(postId, token);
      setComments({ ...comments, [postId]: updatedComments });
      setCommentTexts({ ...commentTexts, [postId]: "" });
    } catch (error) {
      alert("Error al comentar");
    }
  };


  return (
    <>
      <Disclosure
        as="nav"
        className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                onClick={() => setOpen(true)}
                type="button"
                className="justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                + Crear Posts
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                  <span className="absolutew -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden text-sm/6 font-semibold"
                    >
                      Hola {user?.firstName}
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      onClick={() => navigate("/settings")}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      onClick={() => navigate("/")}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>


      {/* DIALOG POST */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-gray-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-white">
                      Create Posts
                    </DialogTitle>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="title" className="block text-sm/6 font-medium text-gray-100">Title</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required autoComplete="title"
                            className="block w-100 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm/6 font-medium text-gray-100">Category</label>
                          <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required autoComplete="category"
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>

                        <div>
                          <label htmlFor="textarea" className="block text-sm/6 font-medium text-gray-100">Add your comment</label>
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required autoComplete="textarea"
                            placeholder="Write your thoughts here..."
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>
                        <button
                          type="submit"
                          onClick={() => setOpen(false)}
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                        >Cancel</button>

                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 sm:ml-3 sm:w-auto"
                        >Create Post</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div>

        <section className="flex justify-center">
          <div className="w-full max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Posts Publicados
            </h2>

            {posts.map(post => (
              <div
                key={post.id}
                className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                {/* POST */}
                <h3 className="text-3xl font-semibold mb-2 text-white">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-500 mb-1">
                  <strong>Categoría:</strong> {post.category}
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {post.content}
                </p>

                <p className="text-xs text-gray-400 mb-4">
                  Publicado: {new Date(post.publishDate).toLocaleDateString()}
                </p>

                {/* INPUT COMMENT */}
                <div className="mb-3">
                  <textarea
                    className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Write a comment..."
                    value={commentTexts[post.id] || ""}
                    onChange={(e) =>
                      setCommentTexts({
                        ...commentTexts,
                        [post.id]: e.target.value
                      })
                    }
                  />
                </div>

                <button
                  onClick={() => handleComment(post.id)}
                  className="w-full mb-6 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                >
                  Post comment
                </button>

                {/* COMMENTS */}
                <div className="space-y-4">
                  {comments[post.id]?.map(comment => (
                    <div
                      key={comment.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          className="w-8 h-8 rounded-full mr-3"
                          src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                          alt={comment.userName}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {comment.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.commentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
