import { mutation, query } from './_generated/server';

const subcategories = [
    // Web Development subcategories
    'Frontend Development', 'Backend Development', 'Full-Stack Development', 'WordPress', 'Shopify', 'E-commerce', 'Web Design',
    // Mobile Development subcategories
    'iOS Development', 'Android Development', 'Flutter Development', 'React Native', 'Xamarin', 'Mobile App Design', 'Mobile Game Development',
    // Design subcategories
    'UI/UX Design', 'Graphic Design', 'Logo Design', 'Branding', 'Illustration', 'Print Design', 'Motion Graphics',
    // Writing subcategories
    'Content Writing', 'Copywriting', 'Technical Writing', 'Creative Writing', 'Proofreading', 'Editing', 'Ghostwriting',
    // Marketing subcategories
    'Social Media Marketing', 'SEO', 'Email Marketing', 'Content Marketing', 'Influencer Marketing', 'PPC Advertising', 'Marketing Strategy',
    // Data Science subcategories
    'Machine Learning', 'Data Analysis', 'Big Data', 'Data Visualization', 'Predictive Analytics', 'Deep Learning', 'Natural Language Processing',
    // Artificial Intelligence subcategories
    'Computer Vision', 'Robotics', 'Speech Recognition', 'AI Ethics', 'Reinforcement Learning', 'Expert Systems', 'Cognitive Computing',
    // Game Development subcategories
    'Game Design', 'Game Programming', 'Game Art', 'Game Testing', 'Game Marketing', 'VR Development', 'AR Development',
    // Finance subcategories
    'Investing', 'Personal Finance', 'Financial Planning', 'Stock Market', 'Cryptocurrency', 'Banking', 'Insurance',
    // Photography subcategories
    'Portrait Photography', 'Landscape Photography', 'Product Photography', 'Event Photography', 'Street Photography', 'Fashion Photography', 'Travel Photography'
    // Add subcategories for other categories as needed
];


export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const categories = await ctx.db.query("categories").collect();
        const subcategoriesCheck = await ctx.db.query("subcategories").collect();

        if (subcategoriesCheck.length > 0) return;

        await Promise.all(
            categories.flatMap((category, index) => {
                const categorySubcategories = subcategories.slice(index * 7, (index + 1) * 7);
                return categorySubcategories.map((subcategoryName) =>
                    ctx.db.insert("subcategories", {
                        categoryId: category._id,
                        name: subcategoryName
                    })
                );
            })
        );

        return;
    },
});