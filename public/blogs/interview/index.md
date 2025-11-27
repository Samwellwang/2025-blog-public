---
attributes:
  - trait_type: xlog_slug
    value: mian-shi-yu-dao-de-suan-fa-ti-md
date_published: 2020-06-15T13:13:03.620Z
sources:
  - xlog
summary: ""
tags:
  - post
title: 面试遇到的算法题
type: note

---

# 面试遇到的算法题



> 今天面试遇到了两道根本算不上算法题的算法题我都没有写出来，我特么都不好意思说出来。

[2020-06-15](http://127.0.0.1:5500/2020/06/15/%E7%AE%97%E6%B3%95%E9%A2%98/)

今天面试遇到了两道根本算不上算法题的算法题我都没有写出来，我特么都不好意思说出来。这块的基础太过于薄弱了。开一篇 blog 记录一下学习会的算法题，之前学了几道 LeetCode。当时觉得自己学会了，但是现在也都忘记了。什么动态规划之类的。

##### [](#删除数组的指定元素 "删除数组的指定元素")删除数组的指定元素

这我竟然都没写出来  
{1,2,3,4} 删除 4

```
public class DeleArrayValue{
    public static void main(String[] args){
        Integer[] arr = {1,2,3,4};
        arr=deleValue(arr,3);
        System.out.print(arr.toString);
    }
    public static Integer[] deleValue(Integer[] array,Integer value){
        int i=0
        for(; i<array.length;i++){
            if(array[i]==value) break;
        }
        if(i+1<array.length){
            System.arraycopy(array,i+1,array,i,array.length-i-1);
        }
        array[array.length-1]=null;
        return array;
    }
}
```

#### [](#反转链表 "反转链表")反转链表

1>2>3>4 变为 4>3>2>1

```
public Node reverse(Node head){
    if(head==null||head.next==null){
        return head;
    }
    Node temp= head.next;//执行到倒数第二个head=3，temp=4
    Node newHead = reversr(head.next); //newHead=4
    temp.next=head;//把当前的3给4的下一个
    head.next=null;//最后一个指向空
    return newHead;
}

```

头结点插入法：

```
public static Node reverseListByIteration(Node head){
    Node temp;
    Node result = new Node(-1);
    while(head!=null){
        temp=head.next;//保存head的下一个用于循环，因为head变化了。
        head.next=result.next;//把result的下一个也就是-1后面的指向的给head的下一个，这样就把之前放在result后面的放到新的后面。
        result.next=head;//然后把head接到result的后面
        head=temp;//遍历用。
    }
    return result.next;
}

```

就地反转法：

emmmm

#### [](#中序遍历 "中序遍历")中序遍历

```
    public List<Integer> inorderTraversal(TreeNode root) {

        List<Integer> list= new ArrayList<>();//刚测试这个应该放在外面
        if(root.left!=null){
            inorderTraversal(root.left);
        }

        list.add(root.val);
        if(root.right!=null){
           inorderTraversal(root.right);
        }

       return list;
}

```

#### [](#前序遍历 "前序遍历")前序遍历

```
     public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> list= new ArrayList<>();
        list.add(root.val);
        if(root.left!=null)
        inorderTraversal(root.left);
        if(root.right!=null)
        inorderTraversal(root.right);
       return list;
}

```

#### [](#后序遍历 "后序遍历")后序遍历

```
      public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> list= new ArrayList<>();
        if(root.left!=null)
       inorderTraversal(root.left);
       if(root.right!=null)
       inorderTraversal(root.right);
       list.add(root.val);
       return list;
} 

```

#### [](#删除单链表的倒数第x个 "删除单链表的倒数第x个")删除单链表的倒数第 x 个

```
 public static Node deleValue(Node head ,int x){
    Node fast = head;//快指针
    Node slow = head;//慢指针
    for(int j =0;j<x-1;j++){//快指针先走的步数，画一下图就是知道是这个x-1.
        fast=fast.next;
    }
    while(fast.next!=null){//当快指针走到头了，慢指针指向的就是要删除的
        fast=fast.next;
        slow=slow.next;
    }
    slow.val=slow.next.val;//把慢指针当前指向的下一个值给当前，
    slow.next=slow.next.next;//然后把下一个指向的值给当前
    return head; //返回头结点
}

```